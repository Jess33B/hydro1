#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include "HX711.h"

#define LOADCELL_DOUT 25
#define LOADCELL_SCK 26

const char *ssid = "Wokwi-GUEST";
const char *password = "";
const String firebase_url = "https://hydro-b2c6c-default-rtdb.firebaseio.com/sensorData.json";

// HX711 setup
HX711 scale;
float calibration_factor = -7050; // adjust when using real load cell

float previousWeight = 500.0; // initial weight
float totalWaterDrank = 0.0;  // in milliliters

// --- Set this to true for Wokwi simulation, false for real sensor ---
const bool useSimulatedWeight = true;

void setup()
{
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected!");

  if (!useSimulatedWeight)
  {
    scale.begin(LOADCELL_DOUT, LOADCELL_SCK);
    scale.set_scale(calibration_factor);
    scale.tare();
    previousWeight = scale.get_units(10);
    Serial.println("Real scale initialized.");
  }
  else
  {
    Serial.println("Using simulated weight for testing.");
  }
}

void loop()
{
  float currentWeight;

  if (useSimulatedWeight)
  {
    // --- Simulate weight decreasing ---
    static float simulatedWeight = 500.0;
    simulatedWeight -= random(1, 10); // decrease 1-10g per loop
    if (simulatedWeight < 0)
      simulatedWeight = 0;
    currentWeight = simulatedWeight;
  }
  else
  {
    // --- Read real HX711 sensor ---
    currentWeight = scale.get_units(10);
  }

  // Calculate how much water was consumed
  float diff = previousWeight - currentWeight;
  if (diff > 0)
  {
    totalWaterDrank += diff;
    Serial.print("User drank: ");
    Serial.print(diff);
    Serial.println(" ml");
    previousWeight = currentWeight;
  }

  // Upload to Firebase
  if (WiFi.status() == WL_CONNECTED)
  {
    HTTPClient http;
    http.begin(firebase_url);
    http.addHeader("Content-Type", "application/json");

    String json = "{\"currentWeight\":" + String(currentWeight, 2) +
                  ",\"totalWaterDrank\":" + String(totalWaterDrank, 2) + "}";

    int code = http.POST(json);
    if (code > 0)
    {
      Serial.print("HTTP Response code: ");
      Serial.println(code);
      Serial.print("Uploaded → ");
      Serial.println(json);
    }
    else
    {
      Serial.print("Error sending POST: ");
      Serial.println(code);
    }
    http.end();
  }
  else
  {
    Serial.println("WiFi not connected!");
  }

  delay(5000); // repeat every 5 seconds
}