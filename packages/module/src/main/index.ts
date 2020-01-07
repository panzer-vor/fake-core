import { Module, register } from "core-fe";
import MainComponent from "./component/Main";
import { State } from "./type";
import "antd/es/layout/style";
import "antd/es/page/style";
import "antd/es/upload/style";
const initialState: State = {
  loading: true,
  nav: {
    collapsed: false
  }
};

class MainModule extends Module<State, {}, {}> {
  *toggleNav(): any {
    this.setState({
      nav: {
        collapsed: !this.state.nav.collapsed
      }
    });
  }
}
const module = register(new MainModule("main", initialState));
export const actions = module.getActions();

export const Main = module.attachLifecycle(MainComponent);
