// UI Module - Reusable UI components

use bevy_egui::egui;

/// Reusable UI components for the editor

pub fn heading(ui: &mut egui::Ui, text: &str) {
    ui.heading(text);
    ui.separator();
}

pub fn icon_button(ui: &mut egui::Ui, icon: &str, tooltip: &str) -> bool {
    ui.button(icon).on_hover_text(tooltip).clicked()
}

pub fn tool_button(ui: &mut egui::Ui, icon: &str, name: &str, selected: bool) -> bool {
    let button = if selected {
        egui::Button::new(format!("{} {}", icon, name))
            .fill(egui::Color32::from_rgb(60, 120, 180))
    } else {
        egui::Button::new(format!("{} {}", icon, name))
    };

    ui.add(button).clicked()
}

pub fn property_label(ui: &mut egui::Ui, label: &str, value: &str) {
    ui.horizontal(|ui| {
        ui.label(format!("{}:", label));
        ui.label(value);
    });
}
