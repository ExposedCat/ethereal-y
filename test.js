import {matches} from 'super-regex'

const parser = new RegExp(/(?:([gim]{0,3}))?\/(.+)\/((?:.|)+?)\/$/gm)
const matched = matches(parser,  `im/test/y/
/test2/s/`);
for (const match of matched) {
  console.log(match)
}