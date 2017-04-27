# 1.0.0-alpha.3

* [CHANGE] Action `do` functions are now bound to the action state, allowing for manipulating things like `isPerforming`
  or accessing action data during performing the action
* [FIX] Fixed visibility change not refreshing `props` observable
* [FEATURE] Add `cancel` to delete describer/state
* [FEATURE/CHANGE] All describers now take state in their overridable functions, to allow for manipulation of things
  like alerts and error state
* [FEATURE] Add `refreshes` event emitter to list states allowing for subscribing to list data changes

# 1.0.0-alpha.2

* Upgrade to ModelSafe `0.7.1`
* Fix props observable being empty on base state

# 1.0.0-alpha1

* Rework library completely - removing components in favour of service/injectable based architecture
* Screens are now composed of:
  * A describer, which takes a ModelSafe model and automatically describes how a CRUDL screen should look
  * A state, which is initialized by a describer and is used to control the actual functionality of a CRUDL screen

# 0.10.0

* Add `setItemsPerPage` to list component

# 0.9.1

* Fix default property values overriding manually provided values

# 0.9.0

* Add `readOnly` support - pulls across from ModelSafe (introduced in ModelSafe 0.6.0)
* The `values` of a property is automatically populated with defaults if it's a ModelSafe ENUM attribute

# 0.8.1

* Move to Angular 4.0.0 stable

# 0.8.0

* Rename `style` to `data` and make it `any`
* Add `data` to attributes and associations for providing extra metadata (e.g. how to display the attribute)
* Remove all the existing `get`/`define` metadata functions in favour of `getPropertyOptions` and `definePropertyOptions`
* Add `@attr` and `@assoc` decorators to match ModelSafe so that you can define things like attribute definition data
  on the model directly
* Add list of values to property definition for supporting of selecting a list of enum values or association values

# 0.7.0

* Add `firstPage`/`lastPage` to the list component
* Add tracking of form errors to the form component, and a `FormError` which should be thrown by the `save`
  function on the form definition when validation errors are received from whatever backend the form
  saved to
* Add `cancel` function to the form definition

# 0.6.3

* Bump with >= Angular 4.0.0-rc.6 requirement

# 0.6.2

* Fix `visible` using older function form on list components

# 0.6.1

* Fix the `visible` input on components to only default if no visible was provided to
  the component manually

# 0.6.0

* Add `visible` decorator for managing whether a property is visible by default
* Moved all of the list state to use property paths instead of properties,
  to support non-ModelSafe properties
* Remove the `visible` function on list definition, instead have a `visible` array
  of all property paths that should be visible on each component
* Add `BaseComponent` that other components extend from

# 0.5.1

* Action and list mode styles are now optional
* Fix label not being used when provided

# 0.5.0

* Fix missing decorators
* Add list modes
* Add `plural` and `singular` to the `BaseDefinition` interface
* Move all list sub-states into a new `ListState` interface, which is passed around
  instead of the sub-states

# 0.3.0

* Add `@label` decorator for setting model property labels
* Add `@filterable` decorator for setting model property filterability
* Add `@sortable` decorator for setting model property sortability
* Remove callback interfaces in favour of simply specifying the function type in the definitions
* Add `setPage`/`nextPage`/`previousPage` to the list component for navigating pagination state
* Rename ASCENDING/DESCENDING to ASC/DESC

# 0.2.0

* Make the definition overrides on the definition generator methods of `Definition` optional

# 0.1.2

* Fix missing module export
* Fix missing error handles for other components

# 0.1.1

* Fix components not being exported correctly
* Fix docs README link

# 0.1.0

* Initial release
