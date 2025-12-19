// Editor Module - Main editor interface and logic

use bevy::prelude::*;
use bevy_egui::{egui, EguiContexts};

use crate::resources::ProjectState;

pub struct EditorPlugin;

impl Plugin for EditorPlugin {
    fn build(&self, app: &mut App) {
        app
            .add_systems(Update, editor_ui_system)
            .add_systems(Update, handle_shortcuts);
    }
}

/// Main editor UI system - renders the 3-panel layout
fn editor_ui_system(
    mut contexts: EguiContexts,
    mut project: ResMut<ProjectState>,
) {
    let ctx = contexts.ctx_mut();

    // Main menu bar
    egui::TopBottomPanel::top("menu_bar").show(ctx, |ui| {
        egui::menu::bar(ui, |ui| {
            ui.menu_button("File", |ui| {
                if ui.button("New Project").clicked() {
                    info!("New project clicked");
                }
                if ui.button("Open Project...").clicked() {
                    info!("Open project clicked");
                }
                if ui.button("Save Project").clicked() {
                    info!("Save project clicked");
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
        ui.painter().text(
            rect.center(),
            egui::Align2::CENTER_CENTER,
            "Game Canvas\n\nClick 'New Project' to get started",
            egui::FontId::proportional(20.0),
            egui::Color32::from_gray(120),
        );
    });

    // Status bar
    egui::TopBottomPanel::bottom("status_bar").show(ctx, |ui| {
        ui.horizontal(|ui| {
            ui.label("Ready");
            ui.separator();
            ui.label("No project loaded");
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
    mut project: ResMut<ProjectState>,
) {
    // Ctrl+N - New project
    if keyboard.pressed(KeyCode::ControlLeft) && keyboard.just_pressed(KeyCode::KeyN) {
        info!("New project shortcut");
    }

    // Ctrl+S - Save project
    if keyboard.pressed(KeyCode::ControlLeft) && keyboard.just_pressed(KeyCode::KeyS) {
        info!("Save project shortcut");
        project.save_needed = false;
    }

    // Ctrl+Z - Undo
    if keyboard.pressed(KeyCode::ControlLeft) && keyboard.just_pressed(KeyCode::KeyZ) {
        info!("Undo");
    }
}
