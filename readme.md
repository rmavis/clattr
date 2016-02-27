# CLATTR

This is a module for managing element attributes.


## Usage

Toggle the class of a hamburger menu:
```
Clattr.toggle(document.getElementById('burger-button'),
              'toggle-on');
```

Highlight required form elements:
```
Clattr.add(formElem.getElementsByClassName('required-inputs'),
           'required-missing');
```

Set a image's alt text:
```
Clattr.set(document.getElementById('img-id'),
           'This image is very good.',
           'alt');
```


## Dependencies

None.


## Details

The `has`, `set`, `add`, `remove`, and `toggle` methods all take
the same three parameters: an element or list of elements, an
attribute value or list of values, and an attribute name or list
of names. The `replace` method is similar except it accepts two
lists of attribute values -- it will remove the first and add the
second -- before the attribute name, for a total of four possible
parameters.

For each method, the first two parameters (three for `replace`)
are required. The third (fourth for `replace`) is optional. If it
not given, then the values will be applied to the currently-set
attribute.

By default, Clattr operates on the `class` attribute. You can
change the attribute that Clattr operates on with the `setAttr`
method. Give it any string or array of strings. You can change
back to the default "class" attribute with the `resetAttr`
method, which takes no parameters.

So calling
```
Clattr.add(document.getElementById('bam'), 'boom')
```

will add "boom" to the class list of the element ID'd "bam", and
```
Clattr.add(document.getElementsByTagName("p"), ['boom', 'room'])
```

will add "boom" and "room" to the class list of each `p` element
in the document. If the element(s) lack a "class" attribute, then
one will be added.

Aside from the boolean returned by the `has` method, each return
value indicates whether the named action occurred on the given
element(s) for each of the given values. So `add` called with a
list of elements and a list of values will return true only if
each value was added to each element. The method will not add a
duplicate class name to the element's list, so if a duplicate
occurs, then `add` will return false, though the method will
effectively ensure that each of the given class names are on each
of the given elements.

The exception to this MO is `toggle`, which will run through the
given class names and remove those it currently has and add those
it doesn't. If all of the given class name(s) are added to all of
the given elements, then it will return true.
