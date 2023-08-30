from flask import Flask, render_template, request, send_file
import pandas as pd

app = Flask(__name__)

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        selected_columns = request.form.getlist("columns")
        
        if selected_columns:
            file = request.files["file"]
            df = pd.read_excel(file)  # Use pandas library
            
            new_df = df[selected_columns]
            new_filename = "new_formatted_excel.xlsx"
            new_df.to_excel(new_filename, index=False)
            
            return send_file(new_filename, as_attachment=True)
    
    return render_template("index.html")

if __name__ == "__main__":
    app.run(debug=True)
