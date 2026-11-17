import sqlite3
import os
from pathlib import Path
from typing import Generator
from contextlib import contextmanager

# Default database file in backend root
DEFAULT_DB_PATH = Path(__file__).resolve().parent.parent.parent / "smartaid.db"
DB_PATH = os.getenv("DATABASE_PATH", str(DEFAULT_DB_PATH))


def get_db_connection() -> sqlite3.Connection:
    """Creates a connection to the SQLite database with row factory enabled."""
    conn = sqlite3.connect(DB_PATH, check_same_thread=False, timeout=10.0)
    conn.row_factory = sqlite3.Row
    return conn


@contextmanager
def get_db() -> Generator[sqlite3.Connection, None, None]:
    """Context manager for safe database transactions."""
    conn = get_db_connection()
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def init_db():
    """Initializes the database schema if tables do not exist."""
    with get_db() as conn:
        cursor = conn.cursor()
        
        # Assessments table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS assessments (
                id TEXT PRIMARY KEY,
                created_at TEXT NOT NULL,
                symptoms TEXT NOT NULL,
                duration TEXT NOT NULL,
                severity TEXT NOT NULL,
                risk_level TEXT NOT NULL,
                possible_categories TEXT NOT NULL,
                guidance TEXT NOT NULL,
                red_flags TEXT NOT NULL,
                next_steps TEXT NOT NULL,
                matched_symptoms TEXT NOT NULL,
                notes TEXT
            );
        """)

        # Feedback table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS feedback (
                id TEXT PRIMARY KEY,
                target_type TEXT NOT NULL,
                target_id TEXT,
                rating INTEGER NOT NULL,
                comment TEXT,
                created_at TEXT NOT NULL
            );
        """)

        # Indexes for fast querying
        cursor.execute("""
            CREATE INDEX IF NOT EXISTS idx_assessments_created ON assessments(created_at DESC);
        """)
        cursor.execute("""
            CREATE INDEX IF NOT EXISTS idx_assessments_risk ON assessments(risk_level);
        """)
        cursor.execute("""
            CREATE INDEX IF NOT EXISTS idx_feedback_created ON feedback(created_at DESC);
        """)
