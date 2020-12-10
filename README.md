# Domestic Repairs

You have been asked to develop a website for a company that specialises in the repair of domestic white goods such as washing machines and cookers.

---

## Links

#### Github (actions, workflows etc.)
https://github.com/daleksla/secondary-ahmed233-sem1/

#### Heroku (deployment & auto. deployment)
https://domestic-repairs-page.herokuapp.com

## Testing

The system should include the data for at least 10 real issues and include the correct details for each. The customer details should also be valid.

You are required to create the following accounts to allow the system to be tested. All accounts should have the password `p455w0rd`:

1. `customer1`
2. `customer2`
3. `technician1`
4. `technician2`

---

## Stage 1

The core functionality consists of three screens:

### Part 1

1. When a `customer` logs in they should see a list of all the issues they have reported and their status.
2. The `customer` should be able to change the status of a job between:
    1. unassigned
    2. in progress
    3. resolved.

### Part 2

There should be a link or button to take them to a screen to report a new issue, this should include:

1. The type of appliance (from a fixed list).
2. The age of the appliance in years (max age 10).
3. The appliance manufacturer (from a fixed list).
4. A multi-line description of the fault.

### Part 3

When a `customer` has added a fault they should be shown a screen listing all the `technicians` who have knowledge of dealing with that type of appliance. It should display their: 

1. Full address.
2. phone number.

---

## Stage 2

The intermediate tasks require you to make changes to the functionality. You will be implementing a feature to allow the technicians to log in and manage their own workload.

1. There should be some accounts flagged as technician accounts. They will log in using the same screen but will see a different set of screens:
    1. The home screen will display a list of unassigned jobs