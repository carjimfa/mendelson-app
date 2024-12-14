use tauri_plugin_sql::{Builder, Migration, MigrationKind};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let migrations = vec![Migration {
        version: 1,
        description: "create songs table",
        sql: "CREATE TABLE IF NOT EXISTS songs (  
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                filePath TEXT,
                addedOn DATE,
                modifiedOn DATE,
                timesPlayed INTEGER,
                rating INTEGER,
                isFavorite BOOLEAN,
                album TEXT,
                albumArtist TEXT,
                artist TEXT,
                artists TEXT,
                title TEXT,
                trackOf INTEGER,
                trackNo INTEGER,
                year INTEGER,
                genre TEXT,
                duration DOUBLE,
                codec TEXT
            )",
        kind: MigrationKind::Up,
    }];

    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:test.db", migrations)
                .build(),
        )
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .target(tauri_plugin_log::Target::new(
                            tauri_plugin_log::TargetKind::Webview,
                        ))
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
