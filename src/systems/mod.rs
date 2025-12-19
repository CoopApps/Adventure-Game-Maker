// Systems Module - Core game systems (RPG stats, quests, etc.)

use bevy::prelude::*;

// Quest for Glory stat system
pub mod rpg_stats {
    use bevy::prelude::*;

    #[derive(Component, Default)]
    pub struct QfGStats {
        pub strength: u32,
        pub intelligence: u32,
        pub agility: u32,
        pub vitality: u32,
        pub luck: u32,
    }

    #[derive(Component, Default)]
    pub struct DerivedStats {
        pub health: u32,
        pub max_health: u32,
        pub stamina: u32,
        pub max_stamina: u32,
        pub mana: u32,
        pub max_mana: u32,
    }
}

pub mod quests {
    // Quest system placeholder
}

pub mod npc_ai {
    // NPC AI placeholder
}
