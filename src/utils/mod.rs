// Utils Module - Helper functions

use std::path::Path;

/// Load project from JSON file
pub fn load_project(_path: &Path) -> Result<crate::resources::ProjectData, String> {
    // TODO: Implement actual loading
    Err("Not implemented yet".to_string())
}

/// Save project to JSON file
pub fn save_project(_path: &Path, _data: &crate::resources::ProjectData) -> Result<(), String> {
    // TODO: Implement actual saving
    Err("Not implemented yet".to_string())
}

/// Generate unique ID
pub fn generate_id(prefix: &str) -> String {
    use std::time::{SystemTime, UNIX_EPOCH};
    let timestamp = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_millis();
    format!("{}_{}", prefix, timestamp)
}
