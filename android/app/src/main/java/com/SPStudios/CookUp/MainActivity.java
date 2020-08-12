package com.SPStudios.CookUp;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;

import com.getcapacitor.community.speechrecognition.SpeechRecognition;
import com.go.capacitor.keepscreenon.CapacitorKeepScreenOn;
import app.xplatform.capacitor.plugins.TTS;

import java.util.ArrayList;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    this.init(savedInstanceState, new ArrayList<Class<? extends Plugin>>() {{
      add(CapacitorKeepScreenOn.class);
      add(SpeechRecognition.class);
      add(TTS.class);
    }});
  }
}
