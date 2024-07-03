import os

import requests
from dotenv import load_dotenv

load_dotenv()

url = "https://yul1.qualtrics.com/API/v3/surveys/"

headers = {
    "Accept": "application/json",
    "X-API-TOKEN": os.getenv("QUALTRICS_API_KEY"),
}

# Get list of surveys
response = requests.get(url, headers=headers)

# Save the ids of the surveys
survey_ids = []
for survey in response.json()["result"]["elements"]:
    survey_ids.append(survey["id"])

# Delete the surveys
for id in survey_ids:
    response = requests.delete(url + id, headers=headers)
    print("Deleted survey with id:", id)
print("DONE")
