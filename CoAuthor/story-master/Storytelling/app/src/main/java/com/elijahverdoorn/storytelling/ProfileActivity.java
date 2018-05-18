package com.elijahverdoorn.storytelling;

import android.content.Intent;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;

import java.io.ByteArrayOutputStream;
import java.io.FileNotFoundException;
import java.io.IOException;

public class ProfileActivity extends BaseActivity{


    private ImageView imageView;


    private int PICK_IMAGE_REQUEST = 1;
    byte[] imageBytes;
    Button pictureButton;


    private Button editBioButton;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_profile_new);

        editBioButton = (Button) findViewById(R.id.editBioButton);

        editBioButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                editBioButton.setVisibility(View.VISIBLE);



            }
        });

        pictureButton = (Button) findViewById(R.id.buttonProfilePicture);//TODO: remove this for profiles that are not the current user.

    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (requestCode == PICK_IMAGE_REQUEST && resultCode == RESULT_OK && data != null && data.getData() != null) {
            Uri uri = data.getData();

            // TODO: 5/3/2016 Save this image, don't just display it
            try {
                Bitmap bitmap = MediaStore.Images.Media.getBitmap(getContentResolver(), uri);
                ByteArrayOutputStream bos = new ByteArrayOutputStream();
                bitmap.compress(Bitmap.CompressFormat.PNG, 10, bos);

                imageView = (ImageView) findViewById(R.id.imageProfile);
                imageView.setImageBitmap(bitmap);

//                // Get the bytes for the database
//                ByteArrayOutputStream bos = new ByteArrayOutputStream();
//                bitmap.compress(Bitmap.CompressFormat.PNG, 10, bos);
//                imageBytes = bos.toByteArray();
            } catch (FileNotFoundException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

}