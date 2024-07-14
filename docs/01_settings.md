# Settings

This page describes all the optional settings, their defaults, and (hopefully) their implications.

### Number of profiles

This defaults to 2, a binary comparison, but can be any positive integer. We recommend no more than 5.

### Number of tasks

This is the number of distinct comparison tasks the respondent sees. More tasks produces more data, but also potentially fatigues the respondent.

### Repeated task

This toggles whether one of the tasks respondents see is an exact duplicate of a previous task. By comparing the rate at which respondents give the same answer to identical questions, it is possible to measure and correct for a certain type of measurement error in conjoint studies. We strongly recommend turning this on.

### Repeated task is shuffled

Option to either flip columns same for repeated tasks

### Which task to repeat?
Which of the tasks should be repeated? This can range from 1 to N where N is the number of tasks.

### Where to repeat?
Where should the repeated task go? This can range from K where K is the index of the task to be repeated to N+1 where N is the number of tasks.

### Ordering of attributes
How should the order of attributes be randomized? The three options are Non random, Participant randomized, and Task randomized. Non-random says that every respondent and every task will have the same attribute order: the one specified by you. Participant-randomized says that each participant sees a different attribute order, but that attribute order is the same for all of that participant's tasks. In other words, each participant sees one ordering of attributes. Task-randomized says that every task has an independently-randomized attribute order. We recommend Participant-randomized as it is less confusing for participants.

