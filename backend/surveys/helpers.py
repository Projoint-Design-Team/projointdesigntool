"""
THIS IS A HELPER FUNCTION TO CLEAR UP THE VIEWS FILE
"""

import csv
import json
import os
import random

import requests
from django.http import FileResponse
from rest_framework import status
from rest_framework.parsers import JSONParser
from rest_framework.response import Response

from .serializers import ExtraSurveySerializer

"""
THIS VARIABLES ARE TRANSFEERED FROM THE LEGACY CODE AND SLIGHTLY MODIFIED
STILL A LOT OF MODIFICATIONS AND OPTIMIZATIONS CAN BE DONE
SAME IS THE CASE WITH THE create_js_file FUNCTION
"""

temp_1 = """// Code to randomly generate conjoint profiles in a Qualtrics survey

// Terminology clarification: 
// Task = Set of choices presented to respondent in a single screen (i.e. pair of candidates)
// Profile = Single list of attributes in a given task (i.e. candidate)
// Attribute = Category characterized by a set of levels (i.e. education level)
// Level = Value that an attribute can take in a particular choice task (i.e. "no formal education")

// Attributes and Levels stored in a 2-dimensional Array 

/* Randomize array in-place using Durstenfeld shuffle algorithm */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // ES6 destructuring swap
    }
    return array;
}

// Function to generate weighted random numbers
function weighted_randomize(prob_array, at_key)
{
  var prob_list = prob_array[at_key];
  
  // Create an array containing cutpoints for randomization
  var cumul_prob = new Array(prob_list.length);
  var cumulative = 0.0;
  for (var i=0;  i < prob_list.length; i++){
    cumul_prob[i] = cumulative;
    cumulative = cumulative + parseFloat(prob_list[i]);
  }

  // Generate a uniform random floating point value between 0.0 and 1.0
  var unif_rand = Math.random();

  // Figure out which integer should be returned
  var outInt = 0;
  for (var k = 0; k < cumul_prob.length; k++){
    if (cumul_prob[k] <= unif_rand){
      outInt = k + 1;
    }
  }

  return(outInt);

}


"""

temp_2_randomize = """// Re-randomize the featurearray
function convertAttributesToFeatureArray(attributes) {
    var featurearray = {};

    attributes.forEach(attr => {
        // Create an entry in featurearray with the attribute name as the key
        featurearray[attr.name] = {
            levels: attr.levels.map(level => level.name), // Extract only the level names
            locked: attr.locked // Directly use the locked property
        };
    });

    return featurearray;
}

var temp_featurearray = convertAttributesToFeatureArray(pythonAttributes);


// Collect attribute keys and separate locked and unlocked attributes
var lockedKeys = [];
var unlockedKeys = [];

// Iterate over temp_featurearray to segregate locked and unlocked attribute keys
for (const [key, value] of Object.entries(temp_featurearray)) {
    if (value.locked) {
        lockedKeys.push(key);
    } else {
        unlockedKeys.push(key);
    }
}

// Re-randomize the featurearray keys
unlockedKeys = shuffleArray(unlockedKeys);
"""


temp_2 = """// Integrate locked keys back into the array at their original indices
var featureArrayKeys = [];
for (const key of Object.keys(temp_featurearray)) {
    if (lockedKeys.includes(key)) {
        // Place locked keys in their original position
        featureArrayKeys.push(key);
    } else {
        // Place the first unlocked key in place of the first non-locked original position
        featureArrayKeys.push(unlockedKeys.shift());
    }
}


// Re-generate the new $featurearray - label it $featureArrayNew
var featureArrayNew = {};
for (var h = 0; h < featureArrayKeys.length; h++){
    featureArrayNew[featureArrayKeys[h]] = featurearray[featureArrayKeys[h]];        
}

"""

temp_3 = """
// Initialize the array returned to the user
// Naming Convention
// Level Name: F-[task number]-[profile number]-[attribute number]
// Attribute Name: F-[task number]-[attribute number]
// Example: F-1-3-2, Returns the level corresponding to Task 1, Profile 3, Attribute 2
// F-3-3, Returns the attribute name corresponding to Task 3, Attribute 3

var returnarray = {};

// For each task p
for (var p = 1; p <= K; p++) {
  // For each profile i
  for (var i = 1; i <= N; i++) {
    // Repeat until non-restricted profile generated
    var complete = false;

    while (!complete) {
      complete = true;
      // Create a count for attributes to be incremented in the next loop
      var attr = 0;

      // Create a dictionary to hold profile's attributes
      var profile_dict = {};

      // For each attribute attribute and level array levels in task p
      for (var q = 0; q < featureArrayKeys.length; q++) {
        // Get Attribute name
        var attr_name = featureArrayKeys[q];

        // Increment attribute count
        attr++;

        // Create key for attribute name
        var attr_key = "F-" + p + "-" + attr;

        // Store attribute name in returnarray
        returnarray[attr_key] = attr_name;

        // Get length of levels array
        var num_levels = featureArrayNew[attr_name].length;

        // Randomly select one of the level indices
        var level_index = weighted ? weighted_randomize(probabilityarray, attr_name) - 1
                                   : Math.floor(Math.random() * num_levels);

        // Pull out the selected level
        var chosen_level = featureArrayNew[attr_name][level_index];

        // Store selected level in profile_dict
        profile_dict[attr_name] = chosen_level;

        // Create key for level in returnarray
        var level_key = "F-" + p + "-" + i + "-" + attr;

        // Store selected level in returnarray
        returnarray[level_key] = chosen_level;
      }

      // Cycle through restrictions to confirm/reject profile
      if (!evaluateRestrictions(profile_dict)) {
        complete = false;  // Restriction check failed
      }

      // If no duplicate profiles are allowed, check for duplicates
      if (noDuplicateProfiles && checkForDuplicateProfiles(returnarray, p, i, featureArrayKeys.length)) {
        complete = false;  // Duplicate profile detected
      }
    }
  }
}

// Evaluate restrictions based on the given profile
function evaluateRestrictions(profile) {
  return restrictionarray.every(function(restriction) {
    return evaluateCondition(profile, restriction.condition) ? evaluateResult(profile, restriction.result) : true;
  });
}

// Evaluate the condition part of the restriction
function evaluateCondition(profile, conditions) {
  return conditions.reduce(function(result, cond, index) {
    var evaluation = (profile[cond.attribute] === cond.value) === (cond.operation === '==');
    return index === 0 ? evaluation : (cond.logical === '&&' ? result && evaluation : result || evaluation);
  }, null);
}

// Evaluate the result part of the restriction
function evaluateResult(profile, results) {
  return results.every(function(res) {
    return (profile[res.attribute] === res.value) === (res.operation === '==');
  });
}

// Check for duplicate profiles within the same task
function checkForDuplicateProfiles(profilesArray, taskNum, profileNum, numAttributes) {
  for (var z = 1; z < profileNum; z++) {
    var identical = true;
    for (var attr = 1; attr <= numAttributes; attr++) {
      if (profilesArray["F-" + taskNum + "-" + profileNum + "-" + attr] !== profilesArray["F-" + taskNum + "-" + z + "-" + attr]) {
        identical = false;
        break;
      }
    }
    if (identical) return true;  // Duplicate found
  }
  return false;  // No duplicates found
}

// Write returnarray to Qualtrics
var returnarrayKeys = Object.keys(returnarray);
"""

temp_4 = """
for (var pr = 0; pr < returnarrayKeys.length; pr++) {
  Qualtrics.SurveyEngine.setEmbeddedData(
    returnarrayKeys[pr],
    returnarray[returnarrayKeys[pr]]
  );
}

"""


"""""" """""" """""" """""" """""" """""" """""" """
""" """""" """""" """ MAIN LOGIC  """ """""" """''
""" """""" """""" """""" """""" """""" """""" """"""


def _create_array_or_prob_string(attributes, isArray):
    arrayString = {}
    for attribute in attributes:
        arrayString[attribute["name"]] = [
            level["name"] if isArray else level["weight"]
            for level in attribute["levels"]
        ]

    return (
        f"var {'featurearray' if isArray else 'probabilityarray'} = "
        + str(arrayString)
        + ";\n\n"
    )


def _send_file_response(filename):
    file = open(filename, "rb")
    response = FileResponse(
        file,
        status=status.HTTP_201_CREATED,
        as_attachment=True,
        filename=filename,
    )
    response.closed = file.close
    # Delete the file
    # os.remove(filename)
    return response


def _create_qualtrics_js_text(request):
    jsname = _create_js_file(request)
    with open(jsname, "r", encoding="utf-8") as file_js:
        js_text = file_js.read()

    return f"""//{json.dumps(request.data)}
    Qualtrics.SurveyEngine.addOnload(function(){{
        {js_text}
    }});
    Qualtrics.SurveyEngine.addOnReady(function(){{
        /* Place your JavaScript here to run when the page is fully displayed */
    }});
    Qualtrics.SurveyEngine.addOnUnload(function(){{
        /* Place your JavaScript here to run when the page is unloaded */
    }});"""


def _create_js_file(request):
    serializer = ExtraSurveySerializer(data=request.data)
    if serializer.is_valid():
        validated_data = serializer.validated_data

        # Convert parameters to types
        attributes = validated_data["attributes"]
        filename = validated_data["filename"]

        # Optional
        restrictions = validated_data["restrictions"]
        num_profiles = validated_data["num_profiles"]
        num_tasks = validated_data["num_tasks"]
        randomize = validated_data["randomize"]
        repeated_tasks = validated_data["repeated_tasks"]
        random = validated_data["random"]
        task_to_repeat = validated_data["task_to_repeat"]
        where_to_repeat = validated_data["where_to_repeat"]
        repeated_tasks_flipped = validated_data["repeated_tasks_flipped"]

        """ Write into file """
        with open(filename, "w", encoding="utf-8") as file_js:
            file_js.write(temp_1)

            file_js.write(_create_array_or_prob_string(attributes, True))
            file_js.write(f"var restrictionarray = {restrictions};\n\n")
            file_js.write(
                _create_array_or_prob_string(attributes, False)
                if random == 1
                else "var probabilityarray = {};\n\n"
            )

            file_js.write(
                "// Indicator for whether weighted randomization should be enabled or not\n"
            )
            file_js.write(
                f"var weighted =  {'true' if repeated_tasks else 'false'};\n\n"
            )
            file_js.write("// K = Number of tasks displayed to the respondent\n")
            file_js.write("var K = " + str(num_tasks) + ";\n\n")
            file_js.write("// N = Number of profiles displayed in each task\n")
            file_js.write("var N = " + str(num_profiles) + ";\n\n")
            file_js.write("// num_attributes = Number of Attributes in the Array\n")
            file_js.write("var num_attributes = featurearray.length;\n\n")
            file_js.write("// Should duplicate profiles be rejected?\n")
            file_js.write(
                "let dupprofiles = ["
                + str(task_to_repeat)
                + ","
                + str(where_to_repeat)
                + "]"
                + "\n"
            )
            file_js.write(
                f"var noDuplicateProfiles = {'false' if repeated_tasks else 'true'};\n\n"
            )
            file_js.write(f"var pythonAttributes = {json.dumps(attributes)};\n\n")

            if randomize == 1:
                file_js.write(temp_2_randomize)
                file_js.write(temp_2)
            else:
                file_js.write("var featureArrayKeys = Object.keys(featurearray);\n\n")
                file_js.write("var featureArrayNew = featurearray;\n\n")

            file_js.write(temp_3)
            if repeated_tasks_flipped:
                file_js.write(
                    """
                    // Duplicate profiles
                    for (const key in returnarray) {{
                    if (returnarray.hasOwnProperty(key)) {{
                        if (key.startsWith('F-{}')) {{
                        let correspondingKey = 'F-{}' + key.substring(3); // Get corresponding key starting with 'F-1'
                        if (returnarray[correspondingKey]) {{
                            returnarray[key] = returnarray[correspondingKey]; // Set value of 'F-2' key to be the same as 'F-1' counterpart
                        }}
                        }}
                    }}
                    }}
                    """.format(
                        str(task_to_repeat), str(where_to_repeat)
                    )
                )
            else:
                file_js.write(
                    """
                let curr = N;
                for (let i = 1; i <= N; i++) {{ // Loop through tasks starting from Task 2
                    let startKey = 'F-{}-' + curr;
                    let trailKey = 'F-{}-' + i;
                    for (let j = 1 ; j <= num_attributes; j++){{
                        let correspondingKey = startKey + '-' + j;
                        let trailCorKey = trailKey + '-' + j;
                        if (returnarray[correspondingKey]){{
                            returnarray[correspondingKey] = returnarray[trailCorKey];
                        }}
                    }};
                    curr -=1;
                }}

                for(let i=1 ; i<=num_attributes; i++){{
                    let startKey = 'F-1-' + i;
                    let trailKey = 'F-2-' + i;
                    if (returnarray[startKey]){{
                        returnarray[startKey] = returnarray[trailKey];
                    }}
                }}""".format(
                        str(task_to_repeat), str(where_to_repeat)
                    )
                )
            file_js.write("\n")
            file_js.write(temp_4)
            file_js.close()
        return filename
    else:
        return Response(serializer.errors, status=400)


def _evaluate_cross_condition(profile, condition):
    """Evaluates a condition based on the profile's attribute values."""
    attribute_value = profile.get(condition["attribute"])
    if condition["operation"] == "==":
        return attribute_value == condition["value"]
    elif condition["operation"] == "!=":
        return attribute_value != condition["value"]
    else:
        raise ValueError(f"Unsupported operation: {condition['operation']}")


def _evaluate_cross_profile_violation(profiles, restriction):
    """Evaluates if the given restriction is violated in any pair of profiles."""
    condition = restriction["condition"]
    result = restriction["result"]

    condition_not_entered = True

    for i in range(len(profiles)):
        for j in range(len(profiles)):
            if i != j:  # Ensure different profiles are compared
                if _evaluate_cross_condition(profiles[i], condition):
                    condition_not_entered = False
                    if _evaluate_cross_condition(profiles[j], result):
                        return True  # Restriction is valid
    if condition_not_entered:
        return True
    return False


def _check_any_cross_profile_restriction_violated(profiles, cross_restrictions):
    """Checks if any cross-profile restrictions are violated."""
    if not cross_restrictions:
        return True
    for restriction in cross_restrictions:
        if _evaluate_cross_profile_violation(profiles, restriction):
            return True
    return False


def _evaluate_condition(profile, conditions):
    current_result = None
    for cond in conditions:
        attr, op, value = cond["attribute"], cond["operation"], cond["value"]
        # Convert operation string to actual operation
        if op == "==":
            result = profile[attr] == value
        elif op == "!=":
            result = profile[attr] != value

        if "logical" in cond:
            if cond["logical"] == "&&":
                current_result = (
                    current_result and result if current_result is not None else result
                )
            elif cond["logical"] == "||":
                current_result = (
                    current_result or result if current_result is not None else result
                )
        else:
            current_result = result
    return current_result


def _evaluate_result(profile, results):
    # Check the 'Then' part
    for res in results:
        attr, op, value = res["attribute"], res["operation"], res["value"]
        if op == "==":
            if not (profile[attr] == value):
                return False
        elif op == "!=":
            if not (profile[attr] != value):
                return False
    return True


def _evaluate_restriction(profile, restriction):
    if _evaluate_condition(profile, restriction["condition"]):
        # If the condition is true, check the result part
        return _evaluate_result(profile, restriction["result"])
    return True


def _check_restrictions(profile, restrictions):
    for restriction in restrictions:
        if not _evaluate_restriction(profile, restriction):
            return False
    return True


def _generate_unlocked_order(attributes):
    """Generate and return a fixed order for unlocked attributes and positions of locked attributes."""
    locked_attrs = []
    unlocked_attrs = []

    for index, attr in enumerate(attributes):
        if attr.get("locked", False):
            locked_attrs.append((index, attr))
        else:
            unlocked_attrs.append((index, attr))

    # Shuffle only once to fix the order for all profiles
    random.shuffle(unlocked_attrs)

    # Prepare the full attribute list including locked positions
    attribute_list = [None] * len(attributes)
    for index, attr in locked_attrs:
        attribute_list[index] = attr

    j = 0  # Iterator for unlocked attributes
    for i in range(len(attribute_list)):
        if attribute_list[i] is None:
            attribute_list[i] = unlocked_attrs[j][1]
            j += 1
    return attribute_list


def _generate_single_profile(attribute_list):
    return {
        attr["name"]: random.choices(
            [level["name"] for level in attr["levels"]],
            [level["weight"] for level in attr["levels"]],
            k=1,
        )[0]
        for attr in attribute_list
    }


def _create_profiles(profiles_num, attribute_list, restrictions, cross_restrictions):
    profiles_valid = False
    while not profiles_valid:
        profiles_list = []
        while len(profiles_list) < profiles_num:
            profile = _generate_single_profile(attribute_list)
            if _check_restrictions(profile, restrictions):
                profiles_list.append(profile)
        profiles_valid = _check_any_cross_profile_restriction_violated(
            profiles_list, cross_restrictions
        )
    return profiles_list


def _write_header(writer, attributes, profiles):
    header = []
    for i in range(1, len(attributes) + 1):
        for j in range(1, profiles + 2):
            if j == 1:
                header.append(f"ATT{i}")
            else:
                header.append(f"ATT{i}P{j-1}")
    writer.writerow(header)


def _rearrange_and_write_profiles(writer, profiles_list, profiles):
    rearrenged_profiles = []
    for i in range(len(profiles_list[0]) // 2):
        rearrenged_profiles.append(profiles_list[0][i * 2])
        for j in range(profiles):
            rearrenged_profiles.append(profiles_list[j][i * 2 + 1])
    writer.writerow(rearrenged_profiles)


def _create_csv_profiles(
    profiles_num,
    attribute_list,
    restrictions,
    cross_restrictions,
    fixed_profile,
    fixed_profile_position,
):
    profiles = _create_profiles(
        profiles_num, attribute_list, restrictions, cross_restrictions
    )
    if fixed_profile:
        fixed_prof = {key: fixed_profile[key] for key in profiles[0].keys()}
        profiles[fixed_profile_position] = fixed_prof
    return [[item for pair in profile.items() for item in pair] for profile in profiles]


def _populate_csv(
    attributes,
    profiles,
    restrictions,
    cross_restrictions,
    csv_lines,
    filename,
    fixed_profile,
    fixed_profile_position,
):
    with open(filename, "w") as file:
        writer = csv.writer(file)

        _write_header(writer, attributes, profiles)

        attribute_list = _generate_unlocked_order(attributes)
        for _ in range(csv_lines):
            profiles_list = _create_csv_profiles(
                profiles,
                attribute_list,
                restrictions,
                cross_restrictions,
                fixed_profile,
                fixed_profile_position,
            )
            _rearrange_and_write_profiles(writer, profiles_list, profiles)


def _filter_survey_data(data):
    survey_elements = data.get("SurveyElements")
    for elem in survey_elements:
        if elem.get("PrimaryAttribute") == "QID1":
            payload = elem.get("Payload")
            question_js = payload.get("QuestionJS")
            projoint_survey = question_js.split("\n")[0]
            if "//" in projoint_survey:
                return json.loads(projoint_survey[2:])
            else:
                break
    return Response(
        {"error": "Invalid QSF survey. Please use QSF file from our platform."},
        status=status.HTTP_400_BAD_REQUEST,
    )


def _validate_survey_data(survey_data):
    serializer = ExtraSurveySerializer(data=survey_data)
    if serializer.is_valid():
        return Response(serializer.validated_data, status=status.HTTP_200_OK)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def _validate_file(request, file_type, content_type):
    if "file" not in request.FILES:
        return Response(
            {"error": "No file provided."}, status=status.HTTP_400_BAD_REQUEST
        )

    try:
        file = request.FILES["file"]
    except KeyError as e:
        return Response(
            {"error": f"Invalid file: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST
        )

    if file.content_type != content_type:
        return Response(
            {"error": f"Invalid file type. A {file_type} file is required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        data = JSONParser().parse(file)
    except Exception as e:
        return Response(
            {"error": f"Invalid {file_type} data: {str(e)}"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    return data


"""""" """""" """""" """""" """""" """""" """""" """
""" """""" """QUALTRICS LOGIC""" """""" """""" """
""" """""" """""" """""" """""" """""" """""" """"""


def _create_html(i, num_attr, profiles, qNum, noFlip, qText, profile_naming):
    # if i == 0:
    #     text_out = "<span>Blank page</span>"
    #     return text_out
    # i -= 1
    top = (
        "<span>Question "
        + str(qNum)
        + "</span>\n<br /><br />\n<span>"
        + qText
        + '</span>\n<br />\n<div>\n<br />\n<table class="UserTable">\n<tbody>\n'
    )

    # Create a header row
    header = "<tr>\n<td>&nbsp;</td>\n"
    for k in range(profiles):
        header = (
            header
            + '<td style="text-align: center;">\n<strong>'
            + profile_naming
            + " "
            + str(k + 1)
            + "</strong></td>\n"
        )
    header = header + "</tr>\n"

    # Row Array
    rows = ["A"] * num_attr
    for m in range(num_attr):
        rows[m] = (
            "<tr>\n<td style='text-align: center;'><strong>${e://Field/F-"
            + str(i)
            + "-"
            + str(m + 1)
            + "}</strong></td>\n"
        )
        for n in range(profiles) if noFlip == 0 else range(profiles - 1, -1, -1):
            rows[m] = (
                rows[m]
                + "<td style='text-align: center;'>${e://Field/F-"
                + str(i)
                + "-"
                + str(n + 1)
                + "-"
                + str(m + 1)
                + "}</td>\n"
            )
        rows[m] = rows[m] + "</tr>"

    # Ending
    footer = "</tbody>\n</table>\n</div>"

    text_out = top + header
    for j in rows:
        text_out = text_out + j

    text_out = text_out + footer
    return text_out


def __CreateBlock(surveyID, bl, user_token):
    url = "https://yul1.qualtrics.com/API/v3/survey-definitions/" + surveyID + "/blocks"
    payload = {"Type": "Standard", "Description": "Block"}
    headers = {"Content-Type": "application/json", "X-API-TOKEN": user_token}

    response = requests.request("POST", url, json=payload, headers=headers).json()
    return response["result"]["BlockID"]


def _create_survey(
    name,
    user_token,
    task,
    num_attr,
    profiles,
    currText,
    js,
    task_to_repeat,
    where_to_repeat,
    repeated_tasks_flipped,
    doubleQ,
    qText,
    qType,
    qDescription,
    profile_naming,
):
    url = "https://yul1.qualtrics.com/API/v3/survey-definitions"  # CHANGE DATA CENTER
    payload = {"SurveyName": name, "Language": "EN", "ProjectCategory": "CORE"}
    headers = {"Content-Type": "application/json", "X-API-TOKEN": user_token}
    response = requests.request("POST", url, json=payload, headers=headers).json()
    surveyID = response["result"]["SurveyID"]

    for i in range(task + 1):
        bl = _get_flow(surveyID, user_token)
        if i == 0:
            currText = "This block needs to be placed above your conjoint question blocks.<br>However, you may alter the contents of this block (i.e add an introduction to survey)."
            blockID = bl
        elif i != 0:
            blockID = __CreateBlock(surveyID, bl, user_token)
            currText = _create_html(i, num_attr, profiles, i, 0, qText, profile_naming)
        elif i == where_to_repeat:
            currText = _create_html(
                task_to_repeat,
                num_attr,
                profiles,
                i - 1,
                repeated_tasks_flipped,
                qText,
                profile_naming,
            )
        _create_question(
            surveyID,
            " " if doubleQ and i != 0 else currText,
            qDescription,
            blockID,
            user_token,
            profiles,
            js,
            i,
            profile_naming,
        )

    _emb_fields(surveyID, user_token, num_attr, profiles, task)
    return surveyID


def _create_question(
    surveyID,
    text,
    qDescription,
    blockID,
    user_token,
    profiles,
    js,
    i,
    profile_naming,
):
    url = f"https://yul1.qualtrics.com/API/v3/survey-definitions/{surveyID}/questions"
    querystring = {"blockId": blockID}
    headers = {
        "Content-Type": "application/json",
        "X-API-TOKEN": user_token,
    }

    # Define the question text and number of answer choices
    question_text = text
    num_choices = profiles  # Replace "n" with the actual number of answer choices

    # Create the answer choices based on the number specified
    answer_choices = {
        str(i): {"Display": f"{profile_naming} {i}"} for i in range(1, num_choices + 1)
    }

    # Define the payload to create a multiple-choice question within the specified block
    if i == 0:
        payload = {
            "QuestionText": question_text,
            "DataExportTag": "Introduction",
            "QuestionType": "TE",
            "QuestionJS": js,
            "Language": [],
        }
    else:
        data_tag = f"Q{i}"
        payload = {
            "QuestionText": question_text,
            "QuestionType": "MC",
            # "QuestionDescription": qDescription,
            "Selector": "SAVR",
            "Choices": answer_choices,
            "DataExportTag": data_tag,
            "Language": [],
        }
    requests.post(url, json=payload, headers=headers, params=querystring)


def _get_flow(surveyID, user_token):
    url = "https://yul1.qualtrics.com/API/v3/survey-definitions/" + surveyID + "/flow"
    headers = {"Content-Type": "application/json", "X-API-TOKEN": user_token}
    response = requests.request("GET", url, headers=headers).json()
    # print(response["result"]["Flow"][0]["ID"])
    return response["result"]["Flow"][0]["ID"]


def _emb_fields(surveyID, user_token, num_attr, profiles, tasks):
    url = (
        "https://yul1.qualtrics.com/API/v3/surveys/" + surveyID + "/embeddeddatafields"
    )
    headers = {"X-API-TOKEN": user_token, "Content-Type": "application/json"}

    fields = []
    for i in range(1, tasks + 1):
        for j in range(1, profiles + 1):
            key = f"F-{i}-{j}"
            fields.append({"key": key, "type": "text"})
            for k in range(1, num_attr + 1):
                sub_key = f"{key}-{k}"
                fields.append({"key": sub_key, "type": "text"})

    payload = {"embeddedDataFields": fields}

    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json, application/xml",
        "X-API-TOKEN": user_token,
    }

    # Make the API request to set embedded fields without values
    response = requests.post(url, json=payload, headers=headers)


def _download_survey(surveyID, user_token, doubleQ, qType, filename):
    url = f"https://yul1.qualtrics.com/API/v3/survey-definitions/{surveyID}"
    headers = {
        "Content-Type": "application/json",
        "X-API-TOKEN": user_token,
    }

    querystring = {
        "format": "qsf",
    }

    try:
        response = requests.get(url, headers=headers, params=querystring)
    except Exception as e:
        return f"An error occurred: {str(e)}"

    if qType == "MC":
        questionType = ["MC", "SAVR"]
    elif qType == "Rank":
        questionType = ["RO", "DND"]
    else:
        questionType = ["Slider", "HSLIDER"]
    questionType2 = ["TE", "SL"]

    if response.status_code == 200:
        response_json = response.json()
        qsf_data = response_json.get("result", {})
        # for element in qsf_data.get('SurveyElements', []):
        #     if 'Payload' in element:
        #         payload = element['Payload']
        #         if payload and 'DataExportTag' in payload and payload['DataExportTag'] != 'Introduction':
        #             payload['QuestionJS'] = False

        if doubleQ:
            counter = 0
            for j in qsf_data["SurveyElements"]:
                if "Payload" in j:
                    counter += 1
                    curr = j["Payload"]
                    if curr and "QuestionType" in curr:
                        if counter % 2 == 1:
                            curr["QuestionType"] = questionType[0]
                        else:
                            curr["QuestionType"] = questionType2[0]
                    if curr and "Selector" in curr:
                        if counter % 2 == 1:
                            curr["Selector"] = questionType[1]
                        else:
                            curr["Selector"] = questionType2[1]
        else:
            for j in qsf_data["SurveyElements"]:
                if "Payload" in j:
                    curr = j["Payload"]
                    if curr and "QuestionType" in curr:
                        curr["QuestionType"] = questionType[0]
                    if curr and "Selector" in curr:
                        curr["Selector"] = questionType[1]

        with open(filename, "w") as qsf_file:
            json.dump(qsf_data, qsf_file)
        return True
