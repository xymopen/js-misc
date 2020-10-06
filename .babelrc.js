/** @type {import("@babel/core").TransformOptions};} */
module.exports = {
	presets: [
		require( "@babel/preset-env" ),
	],
	plugins: [
		[ require( "@babel/plugin-proposal-pipeline-operator" ), {
			proposal: "minimal"
		} ]
	]
};
