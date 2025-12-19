// Editor Module - Main editor interface and logic

use bevy::prelude::*;
use bevy_egui::{egui, EguiContexts};
use std::path::PathBuf;

use crate::resources::{ProjectState, ProjectData};
use crate::utils;

// Events for file operations
#[derive(Event)]
pub struct NewProjectEvent;

#[derive(Event)]
pub struct OpenProjectEvent;

#[derive(Event)]
pub struct SaveProjectEvent;

pub struct EditorPlugin;

impl Plugin for EditorPlugin {
    fn build(&self, app: &mut App) {
        app
            .add_event::<NewProjectEvent>()
            .add_event::<OpenProjectEvent>()
            .add_event::<SaveProjectEvent>()
            .add_systems(Update, editor_ui_system)
            .add_systems(Update, handle_shortcuts)
            .add_systems(Update, handle_new_project)
            .add_systems(Update, handle_open_project)
            .add_systems(Update, handle_save_project);
    }
}

/// Main editor UI system - renders the 3-panel layout
fn editor_ui_system(
    mut contexts: EguiContexts,
    mut project: ResMut<ProjectState>,
    mut new_project_events: EventWriter<NewProjectEvent>,
    mut open_project_events: EventWriter<OpenProjectEvent>,
    mut save_project_events: EventWriter<SaveProjectEvent>,
) {
    let ctx = contexts.ctx_mut();

    // Main menu bar
    egui::TopBottomPanel::top("menu_bar").show(ctx, |ui| {
        egui::menu::bar(ui, |ui| {
            ui.menu_button("File", |ui| {
                if ui.button("New Project").clicked() {
                    new_project_events.send(NewProjectEvent);
                    ui.close_menu();
                }
                if ui.button("Open Project...").clicked() {
                    open_project_events.send(OpenProjectEvent);
                    ui.close_menu();
                }
                if ui.button("Save Project").clicked() {
                    save_project_events.send(SaveProjectEvent);
                    ui.close_menu();
                }
                ui.separator();
                if ui.button("Exit").clicked() {
                    std::process::exit(0);
                }
            });

            ui.menu_button("Edit", |ui| {
                if ui.button("Undo").clicked() {}
                if ui.button("Redo").clicked() {}
            });

            ui.menu_button("View", |ui| {
                if ui.button("Reset Layout").clicked() {}
            });

            ui.menu_button("Help", |ui| {
                if ui.button("Documentation").clicked() {}
                if ui.button("About").clicked() {
                    project.show_about = true;
                }
            });
        });
    });

    // Left panel - Project tree
    egui::SidePanel::left("project_tree")
        .default_width(250.0)
        .show(ctx, |ui| {
            ui.heading("Project");
            ui.separator();

            egui::ScrollArea::vertical().show(ui, |ui| {
                ui.label("📁 Rooms");
                ui.label("  📄 Town Square");
                ui.label("  📄 Shop");
                ui.label("  📄 Inn");
                ui.separator();

                ui.label("📁 Characters");
                ui.label("  👤 Guard");
                ui.label("  👤 Merchant");
                ui.separator();

                ui.label("📁 Objects");
                ui.label("  🗝️ Rusty Key");
                ui.label("  🚪 Door");
                ui.separator();

                ui.label("📁 Audio");
                ui.label("  🎵 Town Theme");
                ui.label("  🔊 Door Creak");
            });
        });

    // Right panel - Properties
    egui::SidePanel::right("properties")
        .default_width(300.0)
        .show(ctx, |ui| {
            ui.heading("Properties");
            ui.separator();

            ui.label("No object selected");
            ui.add_space(10.0);

            ui.collapsing("Room Settings", |ui| {
                ui.label("Background: town_square.png");
                ui.label("Size: 320x200");
            });

            ui.collapsing("Hotspot Settings", |ui| {
                ui.label("Name: Door");
                ui.label("Position: (150, 80)");
            });
        });

    // Center panel - Main canvas
    egui::CentralPanel::default().show(ctx, |ui| {
        ui.heading("Canvas");
        ui.separator();

        // This will be the game preview area
        let available_size = ui.available_size();
        let (rect, _response) = ui.allocate_exact_size(
            available_size,
            egui::Sense::click_and_drag(),
        );

        ui.painter().rect_filled(
            rect,
            0.0,
            egui::Color32::from_gray(40),
        );

        // Draw placeholder text
        let canvas_text = if project.project_path.is_some() {
            format!("Game Canvas\n\n{}", project.project_name)
        } else {
            "Game Canvas\n\nClick 'New Project' to get started".to_string()
        };
        ui.painter().text(
            rect.center(),
            egui::Align2::CENTER_CENTER,
            canvas_text,
            egui::FontId::proportional(20.0),
            egui::Color32::from_gray(120),
        );
    });

    // Status bar
    egui::TopBottomPanel::bottom("status_bar").show(ctx, |ui| {
        ui.horizontal(|ui| {
            ui.label("Ready");
            ui.separator();
            if let Some(path) = &project.project_path {
                ui.label(format!("Project: {}", path.display()));
                if project.save_needed {
                    ui.label("(unsaved)");
                }
            } else {
                ui.label("No project loaded");
            }
        });
    });

    // About dialog
    if project.show_about {
        egui::Window::new("About RetroQuest")
            .collapsible(false)
            .resizable(false)
            .show(ctx, |ui| {
                ui.heading("RetroQuest");
                ui.label("Version 0.1.0");
                ui.separator();
                ui.label("A no-code adventure game maker");
                ui.label("with Quest for Glory mechanics");
                ui.add_space(10.0);

                if ui.button("Close").clicked() {
                    project.show_about = false;
                }
            });
    }
}

/// Handle keyboard shortcuts
fn handle_shortcuts(
    keyboard: Res<ButtonInput<KeyCode>>,
    mut new_project_events: EventWriter<NewProjectEvent>,
    mut save_project_events: EventWriter<SaveProjectEvent>,
) {
    // Ctrl+N - New project
    if keyboard.pressed(KeyCode::ControlLeft) && keyboard.just_pressed(KeyCode::KeyN) {
        new_project_events.send(NewProjectEvent);
    }

    // Ctrl+S - Save project
    if keyboard.pressed(KeyCode::ControlLeft) && keyboard.just_pressed(KeyCode::KeyS) {
        save_project_events.send(SaveProjectEvent);
    }

    // Ctrl+Z - Undo (TODO: implement undo system)
    if keyboard.pressed(KeyCode::ControlLeft) && keyboard.just_pressed(KeyCode::KeyZ) {
        info!("Undo");
    }
}

/// Handle new project event
fn handle_new_project(
    mut events: EventReader<NewProjectEvent>,
    mut project: ResMut<ProjectState>,
) {
    for _event in events.read() {
        info!("Creating new project");

        // Create new project with default values
        project.project_name = "Untitled Project".to_string();
        project.project_path = None;
        project.save_needed = true;
        project.current_room = None;

        info!("New project created: {}", project.project_name);
    }
}

/// Handle open project event
fn handle_open_project(
    mut events: EventReader<OpenProjectEvent>,
    mut project: ResMut<ProjectState>,
) {
    for _event in events.read() {
        info!("Opening project file dialog");

        // Open file dialog
        if let Some(path) = rfd::FileDialog::new()
            .add_filter("RetroQuest Project", &["retroquest"])
            .pick_file()
        {
            info!("Loading project from: {}", path.display());

            // Load project
            match utils::load_project(&path) {
                Ok(data) => {
                    project.project_name = data.name.clone();
                    project.project_path = Some(path);
                    project.save_needed = false;
                    project.current_room = None;

                    info!("Project loaded successfully: {}", project.project_name);
                }
                Err(e) => {
                    error!("Failed to load project: {}", e);
                }
            }
        }
    }
}

/// Handle save project event
fn handle_save_project(
    mut events: EventReader<SaveProjectEvent>,
    mut project: ResMut<ProjectState>,
) {
    for _event in events.read() {
        info!("Saving project");

        // If no project path, show save dialog
        let save_path = if let Some(path) = &project.project_path {
            path.clone()
        } else {
            // Show save dialog
            if let Some(path) = rfd::FileDialog::new()
                .add_filter("RetroQuest Project", &["retroquest"])
                .set_file_name(&format!("{}.retroquest", project.project_name))
                .save_file()
            {
                path
            } else {
                return; // User cancelled
            }
        };

        // Create project data
        let project_data = ProjectData {
            name: project.project_name.clone(),
            version: "0.1.0".to_string(),
            rooms: vec![],
            characters: vec![],
            objects: vec![],
            audio: vec![],
        };

        // Save project
        match utils::save_project(&save_path, &project_data) {
            Ok(_) => {
                project.project_path = Some(save_path.clone());
                project.save_needed = false;
                info!("Project saved successfully to: {}", save_path.display());
            }
            Err(e) => {
                error!("Failed to save project: {}", e);
            }
        }
    }
}
