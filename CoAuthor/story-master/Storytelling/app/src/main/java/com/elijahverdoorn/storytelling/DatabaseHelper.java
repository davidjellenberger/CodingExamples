package com.elijahverdoorn.storytelling;

import android.content.Context;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;

/**
 * Created by Elijah on 4/20/2016.
 */
public class DatabaseHelper extends SQLiteOpenHelper {
    //Constants for db name and version
    public static final String DATABASE_NAME_STORY = "stories.db";
    private static final int DATABASE_VERSION_STORY = 11;

    //Constants for identifying table and columns
    public static final String TABLE_STORY = "story";
    public static final String STORY_ID = "_id";
    public static final String STORY_TEXT = "storyText";
    public static final String STORY_CREATED = "storyCreated";
    public static final String STORY_TITLE = "storyTitle";
    public static final String STORY_GENRE = "storyCategory";
    public static final String STORY_NUM_WORDS_PER_EDIT = "numWords";
    public static final String STORY_DESCRIPTION = "storyDescription";
    public static final String CURRENT_TURN = "currentTurn";
    public static final String IMAGE_BLOB_STORIES = "image";
    public static final String[] ALL_COLUMNS_STORIES = {STORY_ID, STORY_TEXT, STORY_CREATED, STORY_GENRE, STORY_TITLE, CURRENT_TURN, IMAGE_BLOB_STORIES};
    private static final String TABLE_CREATE_STORY = "CREATE TABLE " + TABLE_STORY + " (" +
            STORY_ID + " INTEGER PRIMARY KEY AUTOINCREMENT, " +
            STORY_TEXT + " TEXT, " +
            STORY_CREATED + " TEXT default CURRENT_TIMESTAMP, " +
            STORY_GENRE + " TEXT, " +
            STORY_TITLE + " TEXT, " +
            STORY_NUM_WORDS_PER_EDIT + " INTEGER, " +
            STORY_DESCRIPTION + " TEXT, " +
            CURRENT_TURN + " INTEGER, " +
            IMAGE_BLOB_STORIES + " TEXT " +
            ")";
    private static final String TABLE_DROP_STORY = "DROP TABLE IF EXISTS " + TABLE_STORY;

    public static final String TABLE_USERS = "users";
    public static final String USERS_ID = "_id";
    public static final String USERS_NAME = "userName";
    public static final String IMAGE_BLOB_USERS = "image";
    public static final String USERS_CREATED = "userCreated";
    public static final String USERS_BIO = "bio";
    private static final String TABLE_CREATE_USERS = "CREATE TABLE " + TABLE_USERS + " (" +
            USERS_ID + " INTEGER PRIMARY KEY AUTOINCREMENT, " +
            USERS_BIO + " TEXT, " +
            USERS_CREATED + " TEXT default CURRENT_TIMESTAMP, " +
            USERS_NAME + " TEXT, " +
            IMAGE_BLOB_USERS + " TEXT " +
            ")";
    private static final String TABLE_DROP_USERS = "DROP TABLE IF EXISTS " + TABLE_USERS;

    public DatabaseHelper (Context context) {
        super(context, DATABASE_NAME_STORY, null, DATABASE_VERSION_STORY);
    }

    public void updateFromStoryActivity(SQLiteDatabase database, int id, String title, String text) {
        String query = "REPLACE INTO " + TABLE_STORY + " (" + STORY_ID + ", " + STORY_TEXT + ", " + STORY_TITLE + ") VALUES " + "(" + id + ", \"" + text + "\", \"" + title + "\");";
        database.execSQL(query);
    }

    public void updateIfExists(SQLiteDatabase db, int id, String storyTitle, String storyText, String storyGenre, String fileName, int currentTurn) { //TODO: add description
        String query = "INSERT OR REPLACE INTO " + TABLE_STORY + " (" + STORY_ID + ", " + STORY_TEXT + ", " + STORY_TITLE + ", " + STORY_GENRE + ", " + IMAGE_BLOB_STORIES + ", " + CURRENT_TURN + ") VALUES " + "(" + id + ", \"" + storyText + "\", \"" + storyTitle + "\", \"" + storyGenre + "\", \"" + fileName + "\", " + currentTurn + ");";// ON DUPLICATE KEY UPDATE " + STORY_TITLE + "= \"" + storyTitle + "\", " + STORY_TEXT + "= \"" + storyText + "\", " + STORY_GENRE + "= \"" + storyGenre + "\";";
        db.execSQL(query);
    }

    public void updateIfExists(SQLiteDatabase db, int id, String storyTitle, String storyText, String storyGenre, int currentTurn) { //TODO: add description
        String query = "INSERT OR REPLACE INTO " + TABLE_STORY + " (" + STORY_ID + ", " + STORY_TEXT + ", " + STORY_TITLE + ", " + STORY_GENRE + ", " + CURRENT_TURN + ") VALUES " + "(" + id + ", \"" + storyText + "\", \"" + storyTitle + "\", \"" + storyGenre + "\", " + currentTurn + ");";
        // ON DUPLICATE KEY UPDATE " + STORY_TITLE + "= \"" + storyTitle + "\", " + STORY_TEXT + "= \"" + storyText + "\", " + STORY_GENRE + "= \"" + storyGenre + "\";";
        db.execSQL(query);
    }

    public void updateImages(SQLiteDatabase database, int id,String image) {
        String query = "UPDATE " + TABLE_STORY + " SET " + IMAGE_BLOB_STORIES + " = " + image + " WHERE " + STORY_ID + " = " + id + ";";
        database.execSQL(query);
    }

    @Override
    public void onCreate(SQLiteDatabase db) {
        db.execSQL(TABLE_CREATE_STORY);
        db.execSQL(TABLE_CREATE_USERS);
    }

    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        db.execSQL(TABLE_DROP_STORY);
        db.execSQL(TABLE_DROP_USERS);
        onCreate(db);
    }

    public void insertTest(SQLiteDatabase db, String text, String title, String genre) {

    }
}