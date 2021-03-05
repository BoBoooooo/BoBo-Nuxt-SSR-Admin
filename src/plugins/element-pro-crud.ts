/*
 * @file: pro crud 组件注册
 * @author: BoBo
 * @copyright: BoBo
 * @Date: 2020-12-08 14:31:55
 */
import Vue from "vue";
import ElementProCrud from "element-pro-crud";
import { crud } from "@/api/public/crud";
import * as pluginsApi from "@/api/system/form";
const $PROCRUD_OPTION = {
  ...pluginsApi,
  crud,
};
Vue.use(ElementProCrud, $PROCRUD_OPTION);
