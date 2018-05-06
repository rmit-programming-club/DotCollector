import React, {Component} from 'react';
import renderer from 'react-test-renderer';
import Teacher from './index';

window.fetch = () =>{
  return {"then": window.fetch}
};

window.Headers = () =>{

};

test('renders the teacher screen', () => {
  const component = renderer.create(<Teacher />);

  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
