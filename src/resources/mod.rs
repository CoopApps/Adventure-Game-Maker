// Resources Module - Global state and data structures

use bevy::prelude::*;
use serde::{Deserialize, Serialize};
use std::path::PathBuf;

/// Main project state
#[derive(Resource, Default)]
pub struct ProjectState {
    pub project_path: Option<PathBuf>,
    pub project_name: String,
    pub save_needed: bool,
    pub show_about: bool,
    pub current_room: Option<String>,
    pub selected_tool: EditorTool,
}

#[derive(Default, PartialEq)]
pub enum EditorTool {
    #[default]
    Select,
    Hotspot,
    WalkArea,
    Object,
    Character,
}

/// Project data structure (saved to JSON)
#[derive(Serialize, Deserialize, Default, Resource)]
pub struct ProjectData {
    pub name: String,
    pub version: String,
    pub rooms: Vec<Room>,
    pub characters: Vec<Character>,
    pub objects: Vec<GameObject>,
    pub audio: Vec<AudioAsset>,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct Room {
    pub id: String,
    pub name: String,
    pub background: String,
    pub width: u32,
    pub height: u32,
    pub hotspots: Vec<Hotspot>,
    pub walk_areas: Vec<WalkArea>,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct Hotspot {
    pub id: String,
    pub name: String,
    pub x: i32,
    pub y: i32,
    pub width: u32,
    pub height: u32,
    pub on_interact: Vec<Action>,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct WalkArea {
    pub points: Vec<(i32, i32)>,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct Character {
    pub id: String,
    pub name: String,
    pub sprite: String,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct GameObject {
    pub id: String,
    pub name: String,
    pub sprite: String,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct AudioAsset {
    pub id: String,
    pub name: String,
    pub path: String,
    pub asset_type: AudioType,
}

#[derive(Serialize, Deserialize, Clone, PartialEq)]
pub enum AudioType {
    Music,
    SoundEffect,
    Voice,
    Ambient,
}

#[derive(Serialize, Deserialize, Clone)]
pub enum Action {
    Say { text: String },
    PlaySound { audio_id: String },
    ChangeRoom { room_id: String },
    GiveItem { item_id: String },
    // More actions will be added
}
