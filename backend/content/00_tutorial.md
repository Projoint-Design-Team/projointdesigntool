# Tutorial

This guide will walk you through how to create a discrete choice experiment using this tool in conjunction with Qualtrics. We will go through four steps: attributes, settings, restrictions, and exporting to Qualtrics. But first, some nomenclature.

A discrete choice experiment is divided into a number of distinct *tasks*, each of which compares two or more *profiles*. Each set of profiles has the same number of *attributes*: a candidate's party, race, and policy position, or a product's weight, price, and materials. Each attribute takes on a specific *level* for a given profile: for Candidate A, the *party* attribute may take on the level of "Democrat".

## Attributes

The most important part of a discrete choice experiment is setting the attributes and levels: these are the features that are getting randomized. Add attributes by clicking on the "Add Attribute" button, and add levels by clicking on the "Add Level" button.

There are two advanced options on the page where users add attributes and levels. The first controls the order in which attributes appear to respondents. By clicking on the padlock icon to the right of each attribute, the user can control where they appear. A locked icon will always appear in the indicated position, so if the second attribute is locked, that attribute will always appear second in the list of attributes shown to respondents.

The second advanced option controls randomization weights, and can be accesed by clicking on the "Edit Weights" button. This allows researchers to set how frequently each level should appear. Most choice experiments set each level to equal frequency, but this is not necessarily preferred.


## Preview

After you have set the attributes and levels, we recommend going to the Preview screen to preview your study. This produces a single task, which can be refreshed, so the researcher can see what the respondents will see.

## Settings

For details on each of these settings, please see the [Settings page](01_settings.md).


## Restrictions

There are two types of restrictions we discuss: cross-attribute restrictions and cross-profile restrictions. Cross-attribute restrictions prevent a profile from being logically inconsistent. For example, in a conjoint study comparing potential immigrants, if an immigrant has only a middle school education, their career cannot be neurosurgeon. Cross-profile restrictions produce dependencies across the different profiles of one task. For example, in a conjoint study comparing political candidates in a two-party, if one candidate is polling at 60%, the other must be polling at 40% or less.

## Exporting

There are four options for exporting a survey, and we recommend users do at least three of them.

1) Exporting to CSV produces a user-specified number of test data indicating the attributes and levels of a number of random tasks. We recommend using this to double-check that all restrictions and randomization weights were successfully applied, as well as to conduct a power analysis.

2) Exporting to JSON produces a file containing all the information the user set defining the survey. We recommend saving this so that you can recreate the survey settings if you clear your cookies. This JSON file can be imported to this web tool, automating this process.

3) Exporting to JavaScript (JS) produces a file that can be uploaded to Qualtrics to perform randomization. 

4) Exporting to Qualtrics produces a .QSF file that can be loaded into Qualtrics, automatically populating a survey with appropriate randomization and the correct question tasks.