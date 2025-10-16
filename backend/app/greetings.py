@app.route('/greet/<name>', methods=['GET']) 
def greet(name): 
    return jsonify({"message": f"Hello, {name}! Welcome to TechFest 2025"}) 