"""MongoDB Database Connection Module for Art Style Transfer API"""

import os
from datetime import datetime
from typing import List, Dict, Optional, Any
from dotenv import load_dotenv

load_dotenv()

try:
    from pymongo import MongoClient
    from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
    PYMONGO_AVAILABLE = True
except ImportError:
    PYMONGO_AVAILABLE = False


class MongoDBConnection:
    """MongoDB connection handler for Art Style Transfer application."""
    
    def __init__(self, uri: str = None, db_name: str = None):
        self.uri = uri or os.getenv('MONGODB_URI', 'mongodb://localhost:27017')
        self.db_name = db_name or os.getenv('MONGODB_DB_NAME', 'art_style_transfer')
        self.client = None
        self.db = None
        self.connected = False
        
        if PYMONGO_AVAILABLE:
            self._connect()
    
    def _connect(self):
        try:
            self.client = MongoClient(self.uri, serverSelectionTimeoutMS=5000)
            self.client.admin.command('ping')
            self.db = self.client[self.db_name]
            self.connected = True
            print(f"Connected to MongoDB: {self.db_name}")
        except (ConnectionFailure, ServerSelectionTimeoutError) as e:
            print(f"MongoDB connection failed: {e}")
            self.connected = False
        except Exception as e:
            print(f"MongoDB error: {e}")
            self.connected = False
    
    def is_connected(self) -> bool:
        return self.connected and PYMONGO_AVAILABLE
    
    def save_transfer_record(self, record: Dict[str, Any]) -> Optional[str]:
        if not self.is_connected():
            return None
        try:
            result = self.db['transfers'].insert_one(record)
            return str(result.inserted_id)
        except Exception as e:
            print(f"Error saving record: {e}")
            return None
    
    def get_transfer_record(self, result_id: str) -> Optional[Dict]:
        if not self.is_connected():
            return None
        try:
            record = self.db['transfers'].find_one({"result_id": result_id})
            if record:
                record['_id'] = str(record['_id'])
            return record
        except Exception as e:
            print(f"Error fetching record: {e}")
            return None
    
    def get_transfer_history(self, limit: int = 10, skip: int = 0) -> List[Dict]:
        if not self.is_connected():
            return []
        try:
            cursor = self.db['transfers'].find().sort("created_at", -1).skip(skip).limit(limit)
            records = []
            for record in cursor:
                record['_id'] = str(record['_id'])
                if 'created_at' in record and isinstance(record['created_at'], datetime):
                    record['created_at'] = record['created_at'].isoformat()
                records.append(record)
            return records
        except Exception as e:
            print(f"Error fetching history: {e}")
            return []
    
    def delete_transfer_record(self, result_id: str) -> bool:
        if not self.is_connected():
            return False
        try:
            result = self.db['transfers'].delete_one({"result_id": result_id})
            return result.deleted_count > 0
        except Exception as e:
            print(f"Error deleting record: {e}")
            return False
    
    def close(self):
        if self.client:
            self.client.close()
            self.connected = False

