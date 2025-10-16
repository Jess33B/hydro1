#include<Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <DHT.h>

#define DHTPIN 14
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);

const char* ssid = "Wokwi-GUEST";
const char* password = "";
const String firebase_url = "https://hydro-b2c6c-default-rtdb.firebaseio.com/sensorData.json";

void setup() {
  Serial.begin(115200);
  dht.begin();

  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected!");
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    float temperature = dht.readTemperature();
    float humidity = dht.readHumidity();

    if (isnan(temperature) || isnan(humidity)) {
      Serial.println("Failed to read from DHT sensor!");
      return;
    }

    HTTPClient http;
    http.begin(firebase_url);
    http.addHeader("Content-Type", "application/json");

    String json = "{\"temperature\":" + String(temperature, 2) + ",\"humidity\":" + String(humidity, 2) + "}";
    int code = http.POST(json);

    if (code > 0) {
      Serial.print("HTTP Response code: ");
      Serial.println(code);
      Serial.print("Uploaded → ");
      Serial.println(json);
    } else {
      Serial.print("Error on sending POST: ");
      Serial.println(code);
    }

    http.end();
  } else {
    Serial.println("WiFi not connected!");
  }

  delay(10000);  // 10 seconds
}
