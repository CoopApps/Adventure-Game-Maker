// Utils Module - Helper functions

use std::fs;
use std::path::Path;
use serde_json;

/// Load project from JSON file
pub fn load_project(path: &Path) -> Result<crate::resources::ProjectData, String> {
    let contents = fs::read_to_string(path)
        .map_err(|e| format!("Failed to read project file: {}", e))?;

    let project: crate::resources::ProjectData = serde_json::from_str(&contents)
        .map_err(|e| format!("Failed to parse project JSON: {}", e))?;

    Ok(project)
}

/// Save project to JSON file
pub fn save_project(path: &Path, data: &crate::resources::ProjectData) -> Result<(), String> {
    let json = serde_json::to_string_pretty(data)
        .map_err(|e| format!("Failed to serialize project: {}", e))?;

    fs::write(path, json)
        .map_err(|e| format!("Failed to write project file: {}", e))?;

    Ok(())
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
