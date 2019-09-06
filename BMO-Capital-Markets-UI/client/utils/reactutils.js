const React = require('react');

export const mapPropsToChildren = (children, childProps) => {
  if (!children || !children.length || !childProps || (typeof childProps !== 'object')) return children;
  return children.map(child => {
    return child.map(item => {
      return React.cloneElement(item, Object.assign({}, childProps));
    });
  });
};


// This function accepts a child and new props, it returns new child with updated props.
// Pass a a child and new props to be added to the child. (BCMBT - 547)
export const mapPropsToChild = (child, childProps) => {
  return child.map(item => {
    return React.cloneElement(item, Object.assign({}, childProps));
  });
};
