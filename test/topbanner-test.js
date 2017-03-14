import React from 'react';
import { shallow, mount, render } from 'enzyme';
import TopBanner from '../src/top-banner';
describe("A suite", function() {
  it("contains spec with an expectation", function() {
    expect(shallow(<TopBanner />).contains(<div className="top-banner">TopBanner</div>)).toBe(true);
  });

  it("contains spec with an expectation", function() {
    expect(shallow(<TopBanner />).is('.top-banner')).toBe(true);
  });

  it("contains spec with an expectation", function() {
    expect(mount(<TopBanner />).find('.top-banner').length).toBe(1);
  });

  it("can run an expectation with render", function() {
    expect(render(<TopBanner />).find('.top-banner').length).toBe(1);
  });
});
