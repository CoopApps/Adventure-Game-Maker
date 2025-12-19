// RetroQuest - No-Code Adventure Game Maker
// Built with Bevy + egui

use bevy::prelude::*;
use bevy_egui::EguiPlugin;

mod editor;
mod runtime;
mod systems;
mod resources;
mod ui;
mod utils;

use editor::EditorPlugin;
use resources::ProjectState;

fn main() {
    App::new()
        // Core Bevy plugins
        .add_plugins(DefaultPlugins.set(WindowPlugin {
            primary_window: Some(Window {
                title: "RetroQuest - Adventure Game Maker".to_string(),
                resolution: (1600.0, 900.0).into(),
                ..default()
            }),
            ..default()
        }))
        // UI plugin
        .add_plugins(EguiPlugin)

        // RetroQuest plugins
        .add_plugins(EditorPlugin)

        // Resources
        .init_resource::<ProjectState>()

        // Startup systems
        .add_systems(Startup, setup)

        .run();
}

fn setup(mut commands: Commands) {
    // Spawn 2D camera for editor
    commands.spawn(Camera2dBundle::default());

    info!("RetroQuest Editor initialized!");
}
