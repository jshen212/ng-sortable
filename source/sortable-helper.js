(function () {
    'use strict';

    var mainModule = angular.module('ui.sortable');

    /**
     * @ngdoc service
     * @name ui.sortable.service:$helper
     * @requires ng.$document
     * @requires ng.$window
     *
     * @description
     * Angular Sortable + Draggable
     */
    mainModule.factory('$helper', ['$document', '$window',
        function ($document, $window) {
            return {

                /**
                 * @ngdoc method
                 * @name hippo.theme#height
                 * @methodOf ui.sortable.service:$helper
                 *
                 * @description
                 * Get the height of an element.
                 *
                 * @param {Object} element Angular element.
                 * @returns {String} Height
                 */
                height: function (element) {
                    return element.prop('scrollHeight');
                },

                /**
                 * @ngdoc method
                 * @name hippo.theme#width
                 * @methodOf ui.sortable.service:$helper
                 *
                 * @description
                 * Get the width of an element.
                 *
                 * @param {Object} element Angular element.
                 * @returns {String} Width
                 */
                width: function (element) {
                    return element.prop('scrollWidth');
                },

                /**
                 * @ngdoc method
                 * @name hippo.theme#offset
                 * @methodOf ui.sortable.service:$helper
                 *
                 * @description
                 * Get the offset values of an element.
                 *
                 * @param {Object} element Angular element.
                 * @returns {Object} Object with properties width, height, top and left
                 */
                offset: function (element) {
                    var boundingClientRect = element[0].getBoundingClientRect();

                    return {
                        width: element.prop('offsetWidth'),
                        height: element.prop('offsetHeight'),
                        top: boundingClientRect.top + ($window.pageYOffset || $document[0].documentElement.scrollTop),
                        left: boundingClientRect.left + ($window.pageXOffset || $document[0].documentElement.scrollLeft)
                    };
                },

                /**
                 * @ngdoc method
                 * @name hippo.theme#positionStarted
                 * @methodOf ui.sortable.service:$helper
                 *
                 * @description
                 * Get the start position of the target element according to the provided event properties.
                 *
                 * @param {Object} e Event
                 * @param {Object} target Target element
                 * @returns {Object} Object with properties offsetX, offsetY, startX, startY, nowX and dirX.
                 */
                positionStarted: function (e, target) {
                    var pos = {};
                    pos.offsetX = e.pageX - this.offset(target).left;
                    pos.offsetY = e.pageY - this.offset(target).top;
                    pos.startX = pos.lastX = e.pageX;
                    pos.startY = pos.lastY = e.pageY;
                    pos.nowX = pos.nowY = pos.distX = pos.distY = pos.dirAx = 0;
                    pos.dirX = pos.dirY = pos.lastDirX = pos.lastDirY = pos.distAxX = pos.distAxY = 0;
                    return pos;
                },

                dragItem: function(item) {

                    return {
                        index: item.index(),
                        parent: item.sortableScope,
                        source: item,
                        sourceInfo: {
                            index: item.index(),
                            itemScope: item.itemScope,
                            sortableScope: item.sortableScope
                        },

                        moveTo: function(parent, index) { // Move the item to a new position
                            this.parent = parent;
                            //If source Item is in the same Parent.
                            if(this.isSameParent() && this.source.index() < index) { // and target after
                                index--;
                            }
                            this.index = index;
                        },

                        isSameParent: function() {
                            return this.parent.element == this.sourceInfo.sortableScope.element;
                        },

                        isOrderChanged: function() {
                            return this.index != this.sourceInfo.index;
                        },

                        eventArgs: function() {
                            return {
                                source: this.sourceInfo,
                                dest: {
                                    index: this.index,
                                    sortableScope: this.parent
                                }
                            };
                        },

                        apply: function() {
                            this.sourceInfo.sortableScope.removeItem(this.sourceInfo.index); // Remove from source.
                            this.parent.insertItem(this.index, this.source.modelValue); // Insert in to destination.
                        }
                    };
                },

                noDrag: function (targetElm) {
                    return (typeof targetElm.attr('nodrag')) !== 'undefined'
                        || (typeof targetElm.attr('data-nodrag')) !== 'undefined';
                }
            };
        }
    ]);

})();