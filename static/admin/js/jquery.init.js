/*global jQuery:false*/

'use strict';

/*
 * Перемещает включенный jQuery в наше пространство имен, используя noConflict и передавая
 * ему 'true'. Это гарантирует, что включенный jQuery не засоряет глобальное пространство
 * имен (то есть это сохраняет существующие значения для window.$ и window.jQuery).
 */
window.django = { jQuery: jQuery.noConflict(true) };
