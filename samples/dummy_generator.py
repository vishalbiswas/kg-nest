# Used chatgpt for this

import csv
import random

# Sample data with more unique combinations
first_names = [
    "Rohit", "Amit", "Suman", "Priya", "Vikram", "Anjali", "Neha", "Rahul", "Sneha", "Suresh",
    "Akash", "Deepa", "Kiran", "Lakshmi", "Nikhil", "Ritu", "Sanjay", "Tanvi", "Umesh", "Varun"
]
last_names = [
    "Prasad", "Sharma", "Patel", "Nair", "Singh", "Kumar", "Bose", "Mehta", "Gupta", "Verma",
    "Reddy", "Chopra", "Ghosh", "Iyer", "Jain", "Kapoor", "Malhotra", "Pandey", "Rao", "Saxena"
]
age_range = range(18, 70)  # Age range from 18 to 70
genders = ["male", "female", "other"]
addresses = [
    ("A-563 Rakshak Society", "New Pune Road", "Pune", "Maharashtra"),
    ("B-24 Green Park", "Old Delhi Road", "Delhi", "Delhi"),
    ("C-78 Blue Sky Residency", "MG Road", "Bangalore", "Karnataka"),
    ("D-89 Sunrise Apartments", "Linking Road", "Mumbai", "Maharashtra"),
    ("E-12 Lake View Colony", "Sector 5", "Chandigarh", "Punjab"),
    ("F-34 Hilltop Complex", "Park Street", "Kolkata", "West Bengal"),
    ("G-56 Maple Residency", "Ring Road", "Hyderabad", "Telangana"),
    ("H-78 Silver Oak Society", "Anna Nagar", "Chennai", "Tamil Nadu"),
    ("I-90 Emerald Greens", "Sector 62", "Noida", "Uttar Pradesh"),
    ("J-23 Coral Springs", "MG Road", "Gurgaon", "Haryana"),
    ("K-45 Pine Valley", "Golf Course Road", "Gurgaon", "Haryana"),
    ("L-67 Crystal Palace", "Baner Road", "Pune", "Maharashtra"),
    ("M-89 Royal Gardens", "LBS Marg", "Thane", "Maharashtra"),
    ("N-12 Sapphire Heights", "Churchgate", "Mumbai", "Maharashtra"),
    ("O-34 Golden Residency", "Connaught Place", "Delhi", "Delhi"),
    ("P-56 Diamond Towers", "Brigade Road", "Bangalore", "Karnataka"),
    ("Q-78 Emerald Enclave", "Salt Lake", "Kolkata", "West Bengal"),
    ("R-90 Ruby Residency", "Banjara Hills", "Hyderabad", "Telangana"),
    ("S-23 Opal Apartments", "T Nagar", "Chennai", "Tamil Nadu"),
    ("T-45 Topaz Towers", "Indiranagar", "Bangalore", "Karnataka")
]

# File path
file_path = "generated_data_with_more_combinations.csv"

# Generate 100,000 rows of data
num_rows = 100000

with open(file_path, mode='w', newline='') as file:
    writer = csv.writer(file)
    # Write header
    writer.writerow(["name.firstName", "name.lastName", "age", "address.line1", "address.line2", "address.city", "address.state", "gender"])

    # Write rows
    for _ in range(num_rows):
        first_name = random.choice(first_names)
        last_name = random.choice(last_names)
        age = random.choice(age_range)
        
        # Randomly decide whether to include address and gender
        if random.choice([True, False]):
            address = random.choice(addresses)
            address_line1, address_line2, address_city, address_state = address
        else:
            address_line1 = address_line2 = address_city = address_state = ""
        
        gender = random.choice(genders) if random.choice([True, False]) else ""
        
        writer.writerow([first_name, last_name, age, address_line1, address_line2, address_city, address_state, gender])

print(f"{num_rows} rows of data written to {file_path}")