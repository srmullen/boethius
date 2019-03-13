function Statement () {

}

/*
 * Scopes (and possibly other statements) need to be executed even if they are note used in voices.
 * This will allow scope variables to be set on layout items. Or should there be a builtin function for setting props.
 */
Statement.prototype.execute = function () {

}
