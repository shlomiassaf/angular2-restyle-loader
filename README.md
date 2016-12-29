# angular2-restyle-loader
Customize angular 2 component metadata

Allows replacing template & styles metadata in 3rd party components.

This allows complete restyling of components shipped with hard coded templates & styles.

Originally built to customize Material 2 components.

# Implications
When overriding a resource there is a risk of it changing in the future.
If a component is mature the risk of change is low, on evolving components or libraries the risk for change is high.

Since HTML templates are statically analyzed when compiling AOT we get some level of assurance.
For styles its not the case, so make sure you know what you're doing.

# AOT
The restyle loader works only with JIT.
When using AOT the angular compiler runs before webpack and so the loader, though running, has not effect.
To enforce the restyle with AOT you can use [ngc-webpack](https://github.com/shlomiassaf/ngc-webpack)

> ngc-webpack provides the infrastructure but you will have to build a logic using `NgcWebpackPlugin` to replace
paths related to material resources (css, html)

#Example: Restyling Material2

Add the loader to Webpack configuration:
```
 {
    test: /node_modules\/@angular\/material\/.*\.js$/,
    use: [
      {
        loader: 'angular2-restyle-loader',
        options: require('src/material-restyle/material-restyle.config.js')
      }
    ]
  }
```

Note that the **test** is selecting only the material library, for webpack performance reasons only target the directory/ies containing components you want to restyle
The **options** are imported from a module.

This is the config module:
```
const reMeta = require('angular2-restyle-loader');

const config = {
  context: __dirname,
  components: [
    {
      selector: 'md-slide-toggle',
      template: reMeta.uri('./slide-toggle/slide-toggle.html'),
      styles: [
        '.some { position: relative; }',
        reMeta.uri('./slide-toggle/slide-toggle.scss')
      ]
    }
  ]
};

module.exports = config;
```

  - context: the directory absolute to all resources. (Default: root)
  - components: an array of components config items to restyle
  - -- selector: the **exect** selector of the component you wish to restyle.
  - -- template: The new template (optional)
  - -- styles: New styles (optional)

The **template** and **styles** properties represent a replacement for
their corresponding properties in the component metadata.

The **template** property can be a **string** or a **uri** expression.
The **styles** property is an array where each item can be a **string** or a **uri** expression.

In addition you can set **template** or **styles** to a function.
The function accepts 1 parameters: original template / original styles (array)  
The function returns **string** or a **uri** expression for **template** or array of **string** or a **uri** expression for **styles**.  
The function can also return a Promise of the above.

###URI Expressions
Working with strings is limited. Sometimes we want to work with modules.
For examples, if we want to use SASS to define the styles.
Since the configuration executes in a different context we can't **require** the `scss` files directly.  
We can't use strings since they are literal templates/styles.  
` template: reMeta.uri('./slide-toggle/slide-toggle.html')`  

Instead we just use the uri function to tell **angular2-restyle-loader** that it's a resource.
The loader will add the resource to the source code making it run through all the loaders.

You can think that reMeta.uri === require

### Notes:
This loader is experimental.  
It was originally built for @angular/material customization so all SCSS files are recompiled which allows $variable control (fonts, etc...)
Material comes with hard coded CSS files in the components which makes customization very limited.

When you need to restyle:
  1) Try to use existing tools (SASS, component features, etc)
  2) Try to use **restyle** but only to re-compile SCSS while declaring variables
  3) Try Adding styles after (in addition) to the original files
  
> To sum up - try not to rewrite original code.  
If 1, 2 & didn't help try replacing templates/styles.  

## Restyling material slide toggle
After: ![image](https://cloud.githubusercontent.com/assets/5377501/21007829/812c6d92-bcf3-11e6-8fed-02d750e68ca5.png)

Before: ![image](https://cloud.githubusercontent.com/assets/5377501/21007867/c12bf73c-bcf3-11e6-9c51-1b141c4d4a93.png)


```
$md-slide-toggle-width: 48px !default;
$md-slide-toggle-height: 24px !default;
$md-slide-toggle-bar-height: 24px !default;
$md-slide-toggle-thumb-size: 20px !default;
$md-slide-toggle-margin: 0px !default;
$md-slide-toggle-spacing: 10px !default;

@import '~@angular/material/core/theming/all-theme';
@import '~@angular/material/slide-toggle/slide-toggle-theme';
@import '~@angular/material/slide-toggle/slide-toggle';

.md-slide-toggle-bar {
  border-radius: 46px;
}

.md-slide-toggle-thumb-container {
  left: $md-slide-toggle-bar-height - $md-slide-toggle-thumb-size;
}

md-slide-toggle {
  &.md-checked {
    .md-slide-toggle-thumb-container {
      left: - ($md-slide-toggle-bar-height - $md-slide-toggle-thumb-size);
    }
  }
}
```

We can also get this working by using CSS overrides but it will be hard, dirty and painful.
This approach separates the restyling from the app.