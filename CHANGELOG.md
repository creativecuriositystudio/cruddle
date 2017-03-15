# 0.4.0

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
* Add `setPage`/`nextPage`/`previousPage` to the list component for navigating pagination state.
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
