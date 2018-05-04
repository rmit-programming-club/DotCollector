import React from 'react';
import renderer from 'react-test-renderer';
import Student from './index';

test('renders the student screen', () => {
    const component = renderer.create(
      <Student />,
    );

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
