# Cruddle

## Introduction

Cruddle is an Angular 2 library that provides functionality to generate
generic CRUD(L) screens from [ModelSafe](https://github.com/creativecuriositystudio/modelsafe) data models. 
The huge benefit of this is that screens in a CRUDL-based application can have their fields and validations
automatically provided by ModelSafe, so the actual work you need to do develop Angular components
for CRUDL screens is minimal. CRUDL provides all of the functionality and information required for CRUDL screens - 
you just need write the HTML structure of your CRUDL components using the base Cruddle components.

The Cruddle library is made up of the following base components:

* `FormComponent`: A component to be used on a create or update screen.
* `ReadComponent`: A component to be used on a view/read screen.
* `DeleteComponent`: A component to be used on a delete screen.
* `ListComponent`: A component to be used on a list screen.

For explanation of how to use these components, see below.

## Installation

```sh
npm install --save cruddle
```

## Usage

### General Concepts

Cruddle aims to separate the definition of each CRUDL screen
from the actual structure. What this means is you define
the filters, sorting, permissions, contextual actions, fields, etc.
separate to the HTML structure in Cruddle definitions
and then your component's template turns this into an appropiate HTML structure.

There are four types of definitions in Cruddle and they correspond directly
to the available components:

* `FormDefinition`: Defines the functionality of a create/update screen.
* `ReadDefinition`: Defines the functionality of a view/read screen.
* `DeleteDefinition`: Defines the functionality of a delete screen.
* `ListDefinition`: Defines the functionality of a list screen.

### Create & Update

In most applications, a create or update screen will generally
act the same or extremely similar when it comes to UI. To encourage writing minimal code,
Cruddle's create and update component are merged into the one
component `FormComponent`. You can still have two separate
components that both use the `FormComponent` if you need functionality
specific to the create or update screen.

The selector for the form component is `<cruddle-form/>`.
The form component takes a `FormDefinition`, which describes
how the form component actually functions.

### Read

The selector for the read component is `<cruddle-read/>`.
The read component takes a `ReadDefinition`, which describes
how the form component actually functions.

### Delete

The selector for the delete component is `<cruddle-delete/>`.
The delete component takes a `DeleteDefinition`, which describes
how the form component actually functions.

Note that some applications may have the delete screen as a popup
on the list screen rather than a separate screen. If that's the case,
then the delete component can just be ignored and a global action can be
added to the list component.

### List

The selector for the list component is `<cruddle-delete/>`.
The delete component takes a `DeleteDefinition`, which describes
how the form component actually functions.

## Testing

To execute the test suite run:

```sh
npm run test
```

## License

This project is licensed under the MIT license. Please see `LICENSE.md` for more details.

