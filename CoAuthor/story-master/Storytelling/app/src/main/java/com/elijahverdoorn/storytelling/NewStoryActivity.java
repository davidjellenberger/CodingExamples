package com.elijahverdoorn.storytelling;

import android.content.ContentValues;
import android.content.Intent;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.util.Log;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.NumberPicker;
import android.widget.Spinner;

import java.io.ByteArrayOutputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.Socket;
import java.net.UnknownHostException;
import java.util.Arrays;

public class NewStoryActivity extends AppCompatActivity {

    private int PICK_IMAGE_REQUEST = 1;

    Button pictureButton, createButton;
    EditText descriptionEditText, titleEditText;
    NumberPicker numberPicker;
    Spinner genreSpinner;
    ImageView imageView;

    String genreSelected;
    byte[] imageBytes;

    //connection variables
    public static String serverAddress = "rns202-8.cs.stolaf.edu";
    public static int serverPort = 28431;
    public Socket socket;
    public OutputStream outputStream;
    public InputStream inputStream;
    public Boolean connSuccess;
    final String[] possibleVals = {"1","25","50","75","100","250","500", "750", "1000", "1500", "2000", "5000"};

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_new_story);
        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        //Set up wordcount spinner
        numberPicker = (NumberPicker) findViewById(R.id.numberPicker);
        numberPicker.setMaxValue(11);
        numberPicker.setMinValue(1);
        NumberPicker.Formatter formatter = new NumberPicker.Formatter() {
            @Override
            public String format(int value) {
                String temp = possibleVals[value];
                return "" + temp;
            }
        };
        numberPicker.setFormatter(formatter);

        imageView = (ImageView) findViewById(R.id.imageViewNewStory);

        genreSpinner = (Spinner) findViewById(R.id.spinnerGenre);
        ArrayAdapter<CharSequence> adapter = ArrayAdapter.createFromResource(this, R.array.genres_array, android.R.layout.simple_spinner_item);
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        genreSpinner.setAdapter(adapter);
        genreSpinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                genreSelected = (String) parent.getItemAtPosition(position);
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {
                genreSelected = null;
            }
        });

        descriptionEditText = (EditText) findViewById(R.id.editTextDescription);
        titleEditText = (EditText) findViewById(R.id.editTextTitleNewStory);
        pictureButton = (Button) findViewById(R.id.buttonSetPicture);
        pictureButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent();
                intent.setType("image/*"); // only images, no videos!
                intent.setAction(Intent.ACTION_GET_CONTENT);
                startActivityForResult(Intent.createChooser(intent, "Select Image"), PICK_IMAGE_REQUEST);
            }
        });
        createButton = (Button) findViewById(R.id.buttonCreateStory);
        createButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //insert locally
                //insertStory(titleEditText.getText().toString(), descriptionEditText.getText().toString(), genreSelected, numberPicker.getValue());
                //insert to database
                sendStoryConnection.start();
                Log.d("NewStoryActivity", "new story sent to db");
                finish();
            }
        });
    }

    //put a new story into the database based on the stuff in this activity.
    public void insertStory(String title, String description, String genre, int numWords) {
        ContentValues values = new ContentValues();
        values.put(DatabaseHelper.STORY_TITLE, title);
        values.put(DatabaseHelper.STORY_GENRE, genre);
        values.put(DatabaseHelper.STORY_DESCRIPTION, description);
        values.put(DatabaseHelper.STORY_NUM_WORDS_PER_EDIT, numWords);
        Uri storyUri = getContentResolver().insert(StoryProvider.CONTENT_URI, values);
    }


    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (requestCode == PICK_IMAGE_REQUEST && resultCode == RESULT_OK && data != null && data.getData() != null) {
            Uri uri = data.getData();

            // TODO: 5/3/2016 Save this image, don't just display it
            try {
                Bitmap bitmap = MediaStore.Images.Media.getBitmap(getContentResolver(), uri);
                imageView = (ImageView) findViewById(R.id.imageViewNewStory);
                imageView.setImageBitmap(bitmap);

                // Get the bytes for the database
                ByteArrayOutputStream bos = new ByteArrayOutputStream();
                bitmap.compress(Bitmap.CompressFormat.PNG, 5, bos);
                imageBytes = bos.toByteArray();

            } catch (FileNotFoundException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    Thread sendStoryConnection = new Thread(new Runnable() {
        @Override
        public void run() {
            try{
                socket = new Socket(serverAddress, serverPort);
                outputStream = socket.getOutputStream();
                inputStream = socket.getInputStream();
                connSuccess = Boolean.TRUE;
                Log.d("MainActivity", "Connection successful");
                createNewStory(1, titleEditText.getText().toString(), Integer.parseInt(possibleVals[numberPicker.getValue()]), genreSelected, imageBytes);
            } catch (UnknownHostException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    });

    public void createNewStory(int creator, String title, int maxLength, String genre, byte[] image) throws IOException {
        String messageType = "JSON/SQL";
        String messageContent = "{\"type\": \"CreateStory\", \"creator\": " + creator + " , \"title\": \"" + title + "\", \"maxLength\": " + maxLength + ", \"genre\": \"" + genre + "\", \"imageBytes\":\"" + Arrays.toString(image) + "\"}";
        MessageMaker outgoingQuery = new MessageMaker(messageType, messageContent);
        outgoingQuery.send(outputStream);
        MessageMaker response = new MessageMaker(inputStream);
        if (inputStream!=null) {                                                    //Log if query was successful
            Log.d("MainActivity", "New story added");
            Log.d("MainActivity", response.toString());
        }
        else
            Log.d("MainActivity", "New story not added");
    }
}
