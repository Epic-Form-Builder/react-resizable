import React from 'react';
import renderer from 'react-test-renderer';
import {shallow} from 'enzyme';

import ResizableBox from '../lib/ResizableBox';
import Resizable from "../lib/Resizable";

describe('render ResizableBox', () => {
  const props = {
    axis: 'x',
    draggableOpts: {},
    handle: jest.fn((resizeHandle, ref) => <span className={`test-class-${resizeHandle}`} ref={ref} />),
    handleSize: [20, 20],
    height: 50,
    lockAspectRatio: false,
    maxConstraints: [30, 30],
    minConstraints: [10, 10],
    onResize: jest.fn(),
    onResizeStart: jest.fn(),
    onResizeStop: jest.fn(),
    resizeHandles: ['w'],
    transformScale: 1,
    width: 50,
  };
  const children = <span className="children" />;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('snapshot default props', () => {
    const tree = renderer.create(<ResizableBox {...props}>{children}</ResizableBox>).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('with correct props', () => {
    const element = shallow(<ResizableBox {...props}>{children}</ResizableBox>);
    expect(element.state()).toEqual({
      height: 50,
      propsHeight: 50,
      propsWidth: 50,
      width: 50,
    });
    const resizable = element.find(Resizable);
    const fakeEvent = {persist: jest.fn()};
    const data = {node: children, size: {width: 30, height: 30}, handle: 'w'};
    resizable.simulate('resize', fakeEvent, data);
    expect(element.state()).toEqual({
      height: 30,
      propsHeight: 50,
      propsWidth: 50,
      width: 30,
    });
    expect(props.onResize).toHaveBeenCalledWith(fakeEvent, data);
  });

  describe('static getDerivedStateFromProps', () => {
    test('updating with new height/width', () => {
      const element = shallow(<ResizableBox {...props}>{children}</ResizableBox>);
      element.setProps({width: 100, height: 100});
      expect(element.state()).toEqual({
        height: 100,
        propsHeight: 100,
        propsWidth: 100,
        width: 100,
      });
    });

    test('updating with same height/width returns null', () => {
      const element = shallow(<ResizableBox {...props}>{children}</ResizableBox>);
      const prevState = element.state();
      element.setProps({width: 50, height: 50});
      expect(element.state()).toEqual(prevState);
    });
  });
});
