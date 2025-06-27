import { Category, Component, Palette, Variant } from '@react-buddy/ide-toolbox';
import { Fragment } from 'react';
import AntdPalette from '@react-buddy/palette-antd';

export const PaletteTree = () => (
  <Palette>
    <Category name="App">
      <Component name="Loader">
        <Variant>
          <ExampleLoaderComponent />
        </Variant>
      </Component>
    </Category>
  </Palette>
);

export function ExampleLoaderComponent() {
  return <Fragment>Loading...</Fragment>;
}
