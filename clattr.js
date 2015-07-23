/* CLATTR
 *
 * This is a simple object for working with element attributes.
 *
 * Aside from `setAttr` and `resetAttr`, the public methods receive
 * two parameters in the same order: an element or array of elements
 * to operate on, and a string or array of strings to operate with.
 *
 * By default, Clattr operates on the `class` attribute. So calling
 * Clattr.add(document.getElementById('bam'), 'boom')
 * will add "boom" to the class list of the element ID'd "bam", and
 * Clattr.add(document.getElementsByTagName("p"), ['boom', 'room'])
 * will add "boom" and "room" to the class list of each `p` element
 * in the document. If the element(s) lack a "class" attribute, then
 * one will be added.
 *
 * Aside from the boolean returned by the `has` method, each return
 * value indicates whether the named action occurred on the given
 * element(s) for each of the given values. So `add` called with a
 * list of elements and a list of values will return true only if
 * each value was added to each element. The method will not add a
 * duplicate class name to the element's list, so if a duplicate
 * occurs, then `add` will return false, though the method will
 * effectively ensure that each of the given class names are on each
 * of the given elements.
 * 
 * The exception to this modus operandi is `toggle`, which will run
 * through the given class names and remove those it currently has
 * and add those it doesn't. If all of the given class name(s) are
 * added to all of the given elements, then it will return true.
 *
 * You might think this style of returns a little hokey, and it
 * might be. But you'll probably ignore it most of the time anyway,
 * so don't worry about it.
 *
 * You can change the attribute that Clattr operates on with the
 * `setAttr` method. Give it any string. You can change back to the
 * default "class" attribute with the `resetAttr` method.
 */

var Clattr = (function () {

    var attr_name_default = "class";
    var attr_name_active = attr_name_default;
    var elem_attr_array = null;



    function exec(func, elems, attr_list) {
        if (typeof attr_list == 'string') {
            attr_list = [attr_list];
        }

        var ret = func(elems, attr_list);
        elem_attr_array = null;

        return ret;
    }



    function getAttrArray(elem) {
        if (elem.hasAttribute(attr_name_active)) {
            elem_attr_array = elem.getAttribute(attr_name_active).split(" ");
            return elem_attr_array;
        } else {
            return [ ];
        }
    }



    function doesElemHaveAttr(elem, attr_list) {
        var attr_arr = (elem_attr_array) ? elem_attr_array : getAttrArray(elem);
        var n = attr_arr.length,
            has = false;

        if (n > 0) {
            has = true;
            var m = attr_list.length;

            outA:
            for (var o = 0; o < m; o++) {
                var ihas = false,
                    attx = attr_list[o];

                outB:
                for (var i = 0; i < n; i++) {
                    if (attr_arr[i] == attx) {
                        ihas = true;
                        break outB;
                    }
                }

                if (!ihas) {
                    has = false;
                    break outA;
                }
            }
        }

        return has;
    }



    function doesGroupHaveAttr(elem_list, attr_list) {
        var have = true;

        out:
        for (var o = 0, n = elem_list.length; o < n; o++) {
            if (!doesElemHaveAttr(elem_list[o], attr_list)) {
                have = false;
                break out;
            }
        }

        return have;
    }



    function setAttrOnElem(elem, attr_list) {
        if (elem.setAttribute(attr_name_active, attr_list.join(" ").trim())) {
            return true;
        } else {
            return false;
        }
    }



    function addAttrToElem(elem, attr_list) {
        var attr_arr = getAttrArray(elem);
        var m = attr_arr.length,
            added = false;

        if (m == 0) {
            added = setAttrOnElem(elem, attr_list);
        }

        else {
            var m = attr_list.length,
                adds = 0;

            for (var o = 0; o < m; o++) {
                var attx = attr_list[o];

                if (!doesElemHaveAttr(elem, [attx])) {
                    attr_arr.push(attx);
                    adds += 1;
                }
            }

            setAttrOnElem(elem, attr_arr);
            added = (adds == m) ? true : false;
        }

        return added;
    }



    function removeAttrFromElem(elem, attr_list) {
        var attr_arr = getAttrArray(elem);
        var m = attr_arr.length,
            removed = false;

        if (m > 0) {
            var n = attr_list.length,
                keeps = [ ],
                rms = 0;

            for (var o = 0; o < m; o++) {
                var attx = attr_arr[o],
                    keep = true;

                out:
                for (var i = 0; i < n; i++) {
                    if (attr_list[i] == attx) {
                        keep = false;
                        break out;
                    }
                }

                if (keep) {
                    keeps.push(attx);
                } else {
                    rms += 1;
                }
            }

            setAttrOnElem(elem, keeps);
            removed = (rms == n) ? true : false;
        }

        return removed;
    }



    function toggleAttrOnElem(elem, attr_list) {
        var is_on = false;

        if (!removeAttrFromElem(elem, attr_list)) {
            is_on = addAttrToElem(elem, attr_list);
        }

        return is_on;
    }



    function applyToGroup(func, elem_list, attr_list) {
        var n = elem_list.length,
            ops = 0;

        for (var o = 0; o < n; o++) {
            if (func(elem_list[o], attr_list)) {
                ops += 1;
            }
        }

        if (ops == n) {return true;}
        else {return false;}
    }



    function addAttrToGroup(elem_list, attr_list) {
        return applyToGroup(addAttrToElem, elem_list, attr_list);
    }



    function removeAttrFromGroup(elem_list, attr_list) {
        return applyToGroup(removeAttrFromElem, elem_list, attr_list);
    }



    function setAttrOnGroup(elem_list, attr_list) {
        return applyToGroup(setAttrOnElem, elem_list, attr_list);
    }



    function toggleAttrOnGroup(elem_list, attr_list) {
        var m = attr_list.length,
            togs = 0;

        for (var o = 0; o < m; o++) {
            if (applyToGroup(toggleAttrOnElem, elem_list, [attr_list[o]])) {
                togs += 1;
            }
        }

        if (togs == m) {return true;}
        else {return false;}
    }





    /*
     * Public methods.
     */
    return {
        has: function(elems, attrs) {
            var func = (typeof elems == 'array') ? doesElemHaveAttr : doesGroupHaveAttr;
            return exec(func, elems, attrs);
        },

        add: function(elems, attrs) {
            var func = (typeof elems == 'array') ? addAttrToElem : addAttrToGroup;
            return exec(func, elems, attrs);
        },

        remove: function(elems, attrs) {
            var func = (typeof elems == 'array') ? removeAttrFromElem : removeAttrFromGroup;
            return exec(func, elems, attrs);
        },

        toggle: function(elems, attrs) {
            var func = (typeof elems == 'array') ? toggleAttrOnElem : toggleAttrOnGroup;
            return exec(func, elems, attrs);
        },

        set: function(elems, attrs) {
            var func = (typeof elems == 'array') ? setAttrOnElem : setAttrOnGroup;
            return exec(func, elems, attrs);
        },

        setAttr: function(attr) {
            attr_name_active = (typeof attr == 'string') ? attr : attr_name_default;
        },

        resetAttr: function() {
            setAttr();
        }
    };
})();
