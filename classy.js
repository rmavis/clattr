/* CLASSY
 *
 * This is a simple object for working with element classes.
 *
 * The public methods mostly map directly to similarly-named private
 * methods.
 *
 * Aside the from `hasClass` boolean, each method's return value
 * indicates whether the indicated action occurred on the given
 * element(s). So `addToAll` will add the given class to each
 * element in the given list, but if one of those elements already
 * has that class, then the return will be false, because the method
 * did not add the class to every element.
 *
 * The exceptions to this modus operandi are `toggleClass` and
 * `toggleAll`. The return value of `toggleClass` is a boolean
 * indicating whether the given class is currently on the given
 * element, so a returned `false` indicates that the class was
 * removed. The return from `toggleAll` indicates whether the class
 * was toggled onto every element in the list.
 *
 * You might think this style of returns a little hokey, and it
 * might be. But you'll probably ignore it most of the time anyway,
 * so don't worry about it.
 */

var Classy = (function () {

    // var return_mode = 'bool';



    function classArray(elem) {
        if (elem.className) {
            return elem.className.split(" ");
        } else {
            return [ ];
        }
    }



    function doesElemHaveClass(elem, class_name) {
        var arr = classArray(elem);
        var n = arr.length,
            has = false;

        for (var o = 0; o < n; o++) {
            if (arr[o] == class_name) {
                has = true;
            }
        }

        return has;
    }



    function doesGroupHaveClass(list, class_name) {
        var have = true,
            n = list.length;

        for (var o = 0; o < n; o++) {
            have = ((doesElemHaveClass(list[o], class_name)) &&
                    (have)) ? true : false;
        }

        return have;
    }



    function addClassToElem(elem, class_name) {
        var added = false;

        if (elem.className) {
            if (!doesElemHaveClass(elem, class_name)) {
                elem.className += " " + class_name;
                added = true;
            }
        }
        else {
            elem.className = class_name;
            added = true;
        }

        return added;
    }



    function addClassToGroup(list, class_name) {
        var n = list.length,
            added = true;

        for (var o = 0; o < n; o++) {
            added = ((addClassToElem(list[o], class_name)) &&
                     (added)) ? true : false;
        }

        return added;
    }



    function removeClassFromElem(elem, class_name) {
        var old_arr = classArray(elem);
        var old_n = old_arr.length,
            removed = false;

        if (old_n == 0) {
            return removed;
        }
        else {
            var new_str = "";

            for (var o = 0; o < old_n; o++) {
                if (old_arr[o] == class_name) {
                    removed = true;
                } else {
                    new_str += old_arr[o] + " ";
                }
            }

            if (removed) {
                elem.className = new_str.trim();
            }
        }

        return removed;
    }



    function removeClassFromGroup(list, class_name) {
        var removed = true,
            n = list.length;

        for (var o = 0; o < n; o++) {
            removed = ((removeClassFromElem(list[o], class_name)) &&
                       (removed)) ? true : false;
        }

        return removed;
    }



    function toggleClassOnElem(elem, class_name) {
        var is_on = false;

        if (!removeClassFromElem(elem, class_name)) {
            addClassToElem(elem, class_name);
            is_on = true;
        }

        return is_on;
    }



    function toggleClassOnGroup(list, class_name) {
        var n = list.length,
            are_on = true;

        for (var o = 0; o < n; o++) {
            are_on = ((toggleClassOnElem(list[o], class_name)) &&
                      (are_on)) ? true : false;
        }

        return are_on;
    }





    /*
     * Public methods.
     */
    return {
        hasClass: function(elem, class_name) {
            return doesElemHaveClass(elem, class_name);
        },

        allHaveClass: function(list, class_name) {
            return doesGroupHaveClass(list, class_name);
        },

        addClass: function(elem, class_name) {
            return addClassToElem(elem, class_name);
        },

        addToAll: function(list, class_name) {
            return addClassToGroup(list, class_name);
        },

        removeClass: function(elem, class_name) {
            return removeClassFromElem(elem, class_name);
        },

        removeFromAll: function(list, class_name) {
            return removeClassFromGroup(list, class_name);
        },

        toggleClass: function(elem, class_name) {
            return toggleClassOnElem(elem, class_name);
        },

        toggleOnAll: function(list, class_name) {
            return toggleClassOnGroup(list, class_name);
        }
    };
})();
