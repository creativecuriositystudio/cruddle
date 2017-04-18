# Cruddle

## Introduction

Cruddle is an Angular 2 library that provides functionality to generate
generic CRUD(L) screens from [ModelSafe](https://github.com/creativecuriositystudio/modelsafe) data models. 
The huge benefit of this is that screens in a CRUDL-based application can have their fields and validations
automatically provided by ModelSafe, so the actual work you need to do develop Angular components
for CRUDL screens is minimal. Cruddle provides all of the functionality to describe how a screen
should look and perform from a ModelSafe model, and you just need to turn that stateful information
into Angular templates.

For a general run down of how the library works, see the usage section below.

## Installation

```sh
npm install --save cruddle
```

## Usage

### General Concepts

Cruddle separates the concept of a screen into three components:

* The description of a screen, which might describe the columns to show in a list, what buttons
  to show on the screen and so on. Basically a literal description of how the UI might function.
* The user interface (UI) which takes the description of a screen and renders it using
  HTML and then creates visual elements that can change the screen state.
* The state of a screen, which the UI interacts with in order to keep track of certain
  functionality related to the screen. For example, the state of a list might contain
  pagination information

In a sense, the UI can be thought of as visual glue between a screen describer (produces
screen descriptions) and a screen state.

Each different CRUDL action has its own respective describer and state types.
These can be used to write the base components/user interfaces for each CRUDL action.

### Create & Update

In most applications, a create or update screen will generally
act the same or extremely similar when it comes to UI. To encourage writing minimal code,
Cruddle's create and update functionality are described by the single `FormDescriber` class.
In order to generate a `FormState`, you should extend the `FormDescriber` with a model-specific
version.

If you have no custom functionality, you can use the `AutoFormDescriber` provider
included in `CruddleModule` to generate default form describers for models. You will still
need to provide the `save` function to use for saving the form data.

### Read

In order to generate a `ReadState`, you should extend the `ReadDescriber` with a model-specific
version.

If you have no custom functionality, you can use the `AutoReadDescriber` provider
included in `CruddleModule` to generate default read describers for models.

### Delete

In order to generate a `DeleteState`, you should extend the `DeleteDescriber` with a model-specific
version.

If you have no custom functionality, you can use the `AutoDeleteDescriber` provider
included in `CruddleModule` to generate default delete describers for models. You will
still need to provide the `delete` function to use for deleting the model data.

Note that some applications may have the delete screen as a popup
on the list screen rather than a separate screen. If that's the case,
then the delete component can just be ignored and a delete action can be
added to the list component.

### List

In order to generate a `ListState`, you should extend the `ListDescriber` with a model-specific
version.

If you have no custom functionality, you can use the `AutoListDescriber` provider
included in `CruddleModule` to generate default delete describers for models. You will
still need to provide the `refresh` function to use for refreshing the list screen.

## Documentatation

The API documentation generated using [TypeDoc](https://github.com/TypeStrong/typedoc)
is [available online](http://creativecuriositystudio.github.io/cruddle).

To generate API documentation from the code into the `docs` directory, run:

```sh
npm run docs
```

## Testing

To execute the test suite run:

```sh
npm run test
```

## License

This project is licensed under the MIT license. Please see `LICENSE.md` for more details.

