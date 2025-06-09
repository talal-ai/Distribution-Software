import pandas as pd

# Path to the Excel file
file_path = "Reference data/Refernce file.xlsx"

try:
    # Read all sheets
    excel_file = pd.ExcelFile(file_path)
    sheet_names = excel_file.sheet_names
    
    print(f"Found {len(sheet_names)} sheets: {sheet_names}")
    
    # Read each sheet
    for sheet_name in sheet_names:
        print(f"\n\n=== SHEET: {sheet_name} ===")
        df = pd.read_excel(file_path, sheet_name=sheet_name)
        print(f"Shape: {df.shape}")
        print("Columns:", df.columns.tolist())
        print("First few rows:")
        print(df.head().to_string())

except Exception as e:
    print(f"Error reading Excel file: {e}") 