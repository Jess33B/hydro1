#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <HX711.h>

// WiFi and Firebase configuration
const char* ssid = "Wokwi-GUEST";
const char* password = "";
const String firebase_url = "https://hydro-b2c6c-default-rtdb.firebaseio.com/waterIntake.json";

// Flow Sensor
const int FLOW_SENSOR_PIN = 34;
const float FLOW_CALIBRATION_FACTOR = 7.5;  // Pulses per second per L/min
volatile int pulseCount = 0;
float flowRate = 0.0;
float flowMilliLitres = 0;
float totalFlowML = 0;

// Load Cell
const int LOADCELL_DOUT_PIN = 16;
const int LOADCELL_SCK_PIN = 4;
const float LOADCELL_CALIBRATION_FACTOR = -1000;  // Adjust based on calibration
HX711 scale;
float currentWeight = 0;
float previousWeight = 0;
float weightChangeML = 0;
float totalWeightML = 0;

// Timing
unsigned long oldTime = 0;
unsigned long lastFirebaseUpdate = 0;

// Interrupt Service Routine for flow sensor
void IRAM_ATTR pulseCounter() {
  pulseCount++;
}

void setup() {
  Serial.begin(115200);
  
  // Initialize flow sensor
  pinMode(FLOW_SENSOR_PIN, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(FLOW_SENSOR_PIN), pulseCounter, FALLING);
  
  // Initialize load cell
  scale.begin(LOADCELL_DOUT_PIN, LOADCELL_SCK_PIN);
  scale.set_scale(LOADCELL_CALIBRATION_FACTOR);
  scale.tare();  // Reset the scale to 0
  
  // Connect to WiFi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected!");
  
  // Initial weight reading
  previousWeight = scale.get_units(5);  // Get average of 5 readings
  Serial.println("Setup complete. Ready to measure water intake.");
}

void sendToFirebase(float flowRateML, float weightML, float avgML, float totalFlow, float totalWeight) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(firebase_url);
    http.addHeader("Content-Type", "application/json");
    
    String json = "{\"timestamp\":";
    json += millis();
    json += ",\"flowRate\":";
    json += flowRateML;
    json += ",\"weightChange\":";
    json += weightML;
    json += ",\"intake\":";
    json += avgML;
    json += ",\"cumulativeFlow\":";
    json += totalFlow;
    json += ",\"cumulativeWeight\":";
    json += totalWeight;
    json += "}";
    
    int httpResponseCode = http.POST(json);
    
    if (httpResponseCode > 0) {
      Serial.print("Data sent to Firebase, response: ");
      Serial.println(httpResponseCode);
    } else {
      Serial.print("Error sending data: ");
      Serial.println(httpResponseCode);
    }
    
    http.end();
  } else {
    Serial.println("WiFi not connected!");
  }
}

void loop() {
  unsigned long currentTime = millis();
  
  // Process sensor data every second
  if (currentTime - oldTime > 1000) {
    // Disable interrupts while calculating
    detachInterrupt(digitalPinToInterrupt(FLOW_SENSOR_PIN));
    
    // 1. Calculate flow rate from flow sensor
    flowRate = ((1000.0 / (currentTime - oldTime)) * pulseCount) / FLOW_CALIBRATION_FACTOR;
    flowMilliLitres = (flowRate / 60) * 1000;  // Convert to mL/s
    totalFlowML += flowMilliLitres;
    
    // 2. Get weight from load cell
    currentWeight = scale.get_units(5);  // Get average of 5 readings
    weightChangeML = (previousWeight - currentWeight) * 1000;  // Convert kg to ml (1g = 1ml)
    if (weightChangeML > 0) {  // Only consider positive changes (water being consumed)
      totalWeightML += weightChangeML;
    }
    previousWeight = currentWeight;
    
    // Calculate average of both measurements
    float averageIntakeML = (flowMilliLitres + weightChangeML) / 2.0;
    
    // Send to Firebase every 12 seconds
    if (currentTime - lastFirebaseUpdate >= 12000) {
      sendToFirebase(flowMilliLitres, weightChangeML, averageIntakeML, totalFlowML, totalWeightML);
      lastFirebaseUpdate = currentTime;
    }
    
    // Print debug information
    Serial.print("Flow: ");
    Serial.print(flowMilliLitres);
    Serial.print(" mL/s\tWeight: ");
    Serial.print(weightChangeML);
    Serial.print(" mL\tAvg: ");
    Serial.print(averageIntakeML);
    Serial.println(" mL/s");
    
    // Reset the pulse counter
    pulseCount = 0;
    oldTime = currentTime;
    
    // Re-enable interrupts
    attachInterrupt(digitalPinToInterrupt(FLOW_SENSOR_PIN), pulseCounter, FALLING);
  }
  
  delay(10); // Small delay to prevent watchdog reset
}