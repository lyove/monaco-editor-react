// examples
const examples: {
  [key: string]: any;
} = {
  apex: "/* Using a single database query, find all the leads in\nthe database that have the same email address as any\nof the leads being inserted or updated. */\nfor (Lead lead : [SELECT Email FROM Lead WHERE Email IN :leadMap.KeySet()]) {\n  Lead newLead = leadMap.get(lead.Email);\n  newLead.Email.addError('A lead with this email address already exists.');\n}",
  azcli:
    "# Create a resource group.\naz group create --name myResourceGroup --location westeurope\n\n# Create a new virtual machine, this creates SSH keys if not present.\naz vm create --resource-group myResourceGroup --name myVM --image UbuntuLTS --generate-ssh-keys",
  bat: "rem *******Begin Comment**************\nrem This program starts the superapp batch program on the network,\nrem directs the output to a file, and displays the file\nrem in Notepad.\nrem *******End Comment**************\n@echo off\nif exist C:output.txt goto EMPTYEXISTS\nsetlocal\n  path=g:programssuperapp;%path%\n  call superapp>C:output.txt\nendlocal\n:EMPTYEXISTS\nstart notepad c:output.txt",
  c: '/* guuid.c - UUID functions\n *\n * Copyright (C) 2013-2015, 2017 Red Hat, Inc.\n *\n * This library is free software; you can redistribute it and/or modify\n * it under the terms of the GNU Lesser General Public License as\n * published by the Free Software Foundation; either version 2.1 of the\n * licence, or (at your option) any later version.\n *\n * This is distributed in the hope that it will be useful, but WITHOUT\n * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or\n * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Lesser General Public\n * License for more details.\n *\n * You should have received a copy of the GNU Lesser General Public\n * License along with this library; if not, write to the Free Software\n * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301\n * USA.\n *\n * Authors: Marc-André Lureau <marcandre.lureau@redhat.com>\n */\n\n#include "config.h"\n#include <string.h>\n\n#include "gi18n.h"\n#include "gstrfuncs.h"\n#include "grand.h"\n#include "gmessages.h"\n#include "gchecksum.h"\n\n#include "guuid.h"\n\ntypedef struct {\n  guint8 bytes[16];\n} GUuid;\n\n/**\n * SECTION:uuid\n * @title: GUuid\n * @short_description: a universally unique identifier\n *\n * A UUID, or Universally unique identifier, is intended to uniquely\n * identify information in a distributed environment. For the\n * definition of UUID, see [RFC 4122](https://tools.ietf.org/html/rfc4122.html).\n *\n * The creation of UUIDs does not require a centralized authority.\n *\n * UUIDs are of relatively small size (128 bits, or 16 bytes). The\n * common string representation (ex:\n * 1d6c0810-2bd6-45f3-9890-0268422a6f14) needs 37 bytes.\n *\n * The UUID specification defines 5 versions, and calling\n * g_uuid_string_random() will generate a unique (or rather random)\n * UUID of the most common version, version 4.\n *\n * Since: 2.52\n */\n\n/*\n * g_uuid_to_string:\n * @uuid: a #GUuid\n *\n * Creates a string representation of @uuid, of the form\n * 06e023d5-86d8-420e-8103-383e4566087a (no braces nor urn:uuid:\n * prefix).\n *\n * Returns: (transfer full): A string that should be freed with g_free().\n * Since: STATIC\n */\nstatic gchar *\ng_uuid_to_string (const GUuid *uuid)\n{\n  const guint8 *bytes;\n\n  g_return_val_if_fail (uuid != NULL, NULL);\n\n  bytes = uuid->bytes;\n\n  return g_strdup_printf ("%02x%02x%02x%02x-%02x%02x-%02x%02x-%02x%02x"\n                          "-%02x%02x%02x%02x%02x%02x",\n                          bytes[0], bytes[1], bytes[2], bytes[3],\n                          bytes[4], bytes[5], bytes[6], bytes[7],\n                          bytes[8], bytes[9], bytes[10], bytes[11],\n                          bytes[12], bytes[13], bytes[14], bytes[15]);\n}\n\nstatic gboolean\nuuid_parse_string (const gchar *str,\n                   GUuid       *uuid)\n{\n  GUuid tmp;\n  guint8 *bytes = tmp.bytes;\n  gint i, j, hi, lo;\n  guint expected_len = 36;\n\n  if (strlen (str) != expected_len)\n    return FALSE;\n\n  for (i = 0, j = 0; i < 16;)\n    {\n      if (j == 8 || j == 13 || j == 18 || j == 23)\n        {\n          if (str[j++] != \'-\')\n            return FALSE;\n\n          continue;\n        }\n\n      hi = g_ascii_xdigit_value (str[j++]);\n      lo = g_ascii_xdigit_value (str[j++]);\n\n      if (hi == -1 || lo == -1)\n        return FALSE;\n\n      bytes[i++] = hi << 8 | lo;\n    }\n\n  if (uuid != NULL)\n    *uuid = tmp;\n\n  return TRUE;\n}\n\n/**\n * g_uuid_string_is_valid:\n * @str: a string representing a UUID\n *\n * Parses the string @str and verify if it is a UUID.\n *\n * The function accepts the following syntax:\n *\n * - simple forms (e.g. `f81d4fae-7dec-11d0-a765-00a0c91e6bf6`)\n *\n * Note that hyphens are required within the UUID string itself,\n * as per the aforementioned RFC.\n *\n * Returns: %TRUE if @str is a valid UUID, %FALSE otherwise.\n * Since: 2.52\n */\ngboolean\ng_uuid_string_is_valid (const gchar *str)\n{\n  g_return_val_if_fail (str != NULL, FALSE);\n\n  return uuid_parse_string (str, NULL);\n}\n\nstatic void\nuuid_set_version (GUuid *uuid, guint version)\n{\n  guint8 *bytes = uuid->bytes;\n\n  /*\n   * Set the four most significant bits (bits 12 through 15) of the\n   * time_hi_and_version field to the 4-bit version number from\n   * Section 4.1.3.\n   */\n  bytes[6] &= 0x0f;\n  bytes[6] |= version << 4;\n  /*\n   * Set the two most significant bits (bits 6 and 7) of the\n   * clock_seq_hi_and_reserved to zero and one, respectively.\n   */\n  bytes[8] &= 0x3f;\n  bytes[8] |= 0x80;\n}\n\n/*\n * g_uuid_generate_v4:\n * @uuid: a #GUuid\n *\n * Generates a random UUID (RFC 4122 version 4).\n * Since: STATIC\n */\nstatic void\ng_uuid_generate_v4 (GUuid *uuid)\n{\n  int i;\n  guint8 *bytes;\n  guint32 *ints;\n\n  g_return_if_fail (uuid != NULL);\n\n  bytes = uuid->bytes;\n  ints = (guint32 *) bytes;\n  for (i = 0; i < 4; i++)\n    ints[i] = g_random_int ();\n\n  uuid_set_version (uuid, 4);\n}\n\n/**\n * g_uuid_string_random:\n *\n * Generates a random UUID (RFC 4122 version 4) as a string.\n *\n * Returns: (transfer full): A string that should be freed with g_free().\n * Since: 2.52\n */\ngchar *\ng_uuid_string_random (void)\n{\n  GUuid uuid;\n\n  g_uuid_generate_v4 (&uuid);\n\n  return g_uuid_to_string (&uuid);\n}',
  clojure:
    '(ns game-of-life\n  "Conway\'s Game of Life, based on the work of\n  Christophe Grand (http://clj-me.cgrand.net/2011/08/19/conways-game-of-life)\n  and Laurent Petit (https://gist.github.com/1200343).")\n\n;;; Core game of life\'s algorithm functions\n\n(defn neighbors\n  "Given a cell\'s coordinates `[x y]`, returns the coordinates of its\n  neighbors."\n  [[x y]]\n  (for [dx [-1 0 1]\n        dy (if (zero? dx)\n             [-1 1]\n             [-1 0 1])]\n    [(+ dx x) (+ dy y)]))\n\n(defn step\n  "Given a set of living `cells`, computes the new set of living cells."\n  [cells]\n  (set (for [[cell n] (frequencies (mapcat neighbors cells))\n             :when (or (= n 3)\n                       (and (= n 2)\n                            (cells cell)))]\n         cell)))\n\n;;; Utility methods for displaying game on a text terminal\n\n(defn print-grid\n  "Prints a `grid` of `w` columns and `h` rows, on *out*, representing a\n  step in the game."\n  [grid w h]\n  (doseq [x (range (inc w))\n          y (range (inc h))]\n    (when (= y 0) (println))\n    (print (if (grid [x y])\n             "[X]"\n             " . "))))\n\n(defn print-grids\n  "Prints a sequence of `grids` of `w` columns and `h` rows on *out*,\n  representing several steps."\n  [grids w h]\n  (doseq [grid grids]\n    (print-grid grid w h)\n    (println)))\n\n;;; Launches an example grid\n\n(def grid\n  "`grid` represents the initial set of living cells"\n  #{[2 1] [2 2] [2 3]})\n\n(print-grids (take 3 (iterate step grid)) 5 5)',
  coffeescript:
    '"""\nA CoffeeScript sample.\n"""\n\nclass Vehicle\n  constructor: (@name) =>\n  \n  drive: () =>\n    alert "Conducting #{@name}"\n\nclass Car extends Vehicle\n  drive: () =>\n    alert "Driving #{@name}"\n\nc = new Car "Brandie"\n\nwhile notAtDestination()\n  c.drive()\n\nraceVehicles = (new Car for i in [1..100])\n\nstartRace = (vehicles) -> [vehicle.drive() for vehicle in vehicles]\n\nfancyRegExp = ///\n  (d+) # numbers\n  (w*) # letters\n  $   # the end\n///',
  cpp: '#include <iostream>\n#include <vector>\n\nstd::vector<int> find_prime_factors(int n)\n{\n  std::vector<int> result;\n  for (int i = 2; i <= n; i++)\n  {\n    while (n % i == 0)\n    {\n      result.push_back(i);\n      n = n/i;\n    }\n  }\n  return result;\n}\n\nint main()\n{\n  int n;\n  std::cout << "Enter number\n";\n  std::cin >> n;\n  std::vector<int> prime_factors;\n  prime_factors = find_prime_factors(n);\n  std::cout << "Prime Factors of " << n << ":\n";\n  for (int i = 0; i < prime_factors.size(); i++)\n  {\n    std::cout << prime_factors[i] << " ";\n  }\n  std::cout << "\n";\n}',
  csharp:
    'using System;\nusing System.Collections.Generic;\nusing System.Diagnostics;\nusing System.Linq;\nusing System.Text;\nusing System.Threading.Tasks;\n\nnamespace VS\n{\n  class Program\n  {\n    static void Main(string[] args)\n    {\n      ProcessStartInfo si = new ProcessStartInfo();\n      float load= 3.2e02f;\n\n      si.FileName = @"tools\\node.exe";\n      si.Arguments = "tools\\simpleserver.js";\n\n      Process.Start(si);\n    }\n  }\n}',
  csp: "Content-Security-Policy: default-src 'self'; img-src *; media-src media1.com media2.com; script-src userscripts.example.com",
  css: "@keyframes flip {\n  from {\n    transform: perspective(400px) scale3d(1, 1, 1) translate3d(0, 0, 0) rotate3d(0, 1, 0, -360deg);\n    animation-timing-function: ease-out;\n  }\n\n  40% {\n    transform: perspective(400px) scale3d(1, 1, 1) translate3d(0, 0, 150px)\n      rotate3d(0, 1, 0, -190deg);\n    animation-timing-function: ease-out;\n  }\n\n  50% {\n    transform: perspective(400px) scale3d(1, 1, 1) translate3d(0, 0, 150px)\n      rotate3d(0, 1, 0, -170deg);\n    animation-timing-function: ease-in;\n  }\n\n  80% {\n    transform: perspective(400px) scale3d(0.95, 0.95, 0.95) translate3d(0, 0, 0)\n      rotate3d(0, 1, 0, 0deg);\n    animation-timing-function: ease-in;\n  }\n\n  to {\n    transform: perspective(400px) scale3d(1, 1, 1) translate3d(0, 0, 0) rotate3d(0, 1, 0, 0deg);\n    animation-timing-function: ease-in;\n  }\n}\n\n.animated.flip {\n  backface-visibility: visible;\n  animation-name: flip;\n}",
  dockerfile: "FROM ubuntu:18.04\nCOPY . /app\nRUN make /app\nCMD python /app/app.py",
  fsharp:
    '(* Sample F# application *)\n[<EntryPoint>]\nlet main argv = \n    printfn "%A" argv\n    System.Console.WriteLine("Hello from F#")\n    0 // return an integer exit code\n\n//--------------------------------------------------------',
  go: 'package main\n\nimport (\n  "fmt"\n  "time"\n)\n\nfunc readword(ch chan string) {\n  fmt.Println("Type a word, then hit Enter.")\n  var word string\n  fmt.Scanf("%s", &word)\n  ch <- word\n}\n\nfunc timeout(t chan bool) {\n  time.Sleep(5 * time.Second)\n  t <- false\n}\n\nfunc main() {\n  t := make(chan bool)\n  go timeout(t)\n\n  ch := make(chan string)\n  go readword(ch)\n\n  select {\n  case word := <-ch:\n      fmt.Println("Received", word)\n  case <-t:\n      fmt.Println("Timeout.")\n  }\n}',
  graphql:
    "type Query {\n  me: User!\n  searchForLocation(byGPS: GPSInput, byAddress: AddressInput): LocationPagingConnection\n}\n\ntype Mutation {\n  addLocation(location: LocationInput): Location\n  addReview(review: ReviewInput): Review\n  addFavorite(locationId: ID!): Location\n}",
  handlebars:
    '<div class="entry">\n  <h1>{{title}}</h1>\n  {{#if author}}\n  <h2>{{author.firstName}} {{author.lastName}}</h2>\n  {{else}}\n  <h2>Unknown Author</h2>\n  {{/if}}\n  {{contentBody}}\n</div>\n\n{{#unless license}}\n  <h3 class="warning">WARNING: This entry does not have a license!</h3>\n{{/unless}}\n\n<div class="footnotes">\n  <ul>\n    {{#each footnotes}}\n    <li>{{this}}</li>\n    {{/each}}\n  </ul>\n</div>\n\n<h1>Comments</h1>\n\n<div id="comments">\n  {{#each comments}}\n  <h2><a href="/posts/{{../permalink}}#{{id}}">{{title}}</a></h2>\n  <div>{{body}}</div>\n  {{/each}}\n</div>',
  html: '<html>\n  <head>\n    <title>HTML Sample</title>\n    <meta http-equiv="X-UA-Compatible" content="IE=edge">\n    <style type="text/css">\n      h1 {\n        color: #CCA3A3;\n      }\n    </style>\n    <script type="text/javascript">\n      alert("I am a sample...");\n    </script>\n  </head>\n  <body>\n    <h1>Heading No.1</h1>\n    <input disabled type="button" value="Click me" />\n  </body>\n</html>',
  ini: '# Example of a .gitconfig file\n\n[core]\n  repositoryformatversion = 0\n  filemode = false\n  bare = false\n  logallrefupdates = true\n  symlinks = false\n  ignorecase = true\n  hideDotFiles = dotGitOnly\n\n# Defines the master branch\n[branch "master"]\n  remote = origin\n  merge = refs/heads/master',
  java: 'import java.util.ArrayList;\nimport org.junit.Test;\n\npublic class Example {\n  @Test \n  public void method() {\n    org.junit.Assert.assertTrue( "isEmpty", new ArrayList<Integer>().isEmpty());\n  }\n\n  @Test(timeout=100) public void infinity() {\n    while(true);\n  }\n }',
  javascript: `// @lyove/monaco-edito-react is Monaco editor wrapper for easy/one-line integration with\n// React applications without need of webpack (or other module bundler) configuration files.\n\nimport React, { useState } from "react";\nimport ReactDOM from "react-dom";\n\nimport Editor from "@lyove/monaco-editor-react";\nimport examples from "./examples";\n\nfunction App() {\n  const [theme, setTheme] = useState("light");\n  const [language, setLanguage] = useState("javascript");\n  const [isEditorReady, setIsEditorReady] = useState(false);\n\n  function handleEditorDidMount() {\n    setIsEditorReady(true);\n  }\n\n  function toggleTheme() {\n    setTheme(theme === "light" ? "dark" : "light");\n  }\n\n  function toggleLanguage() {\n    setLanguage(language === "javascript" ? "python" : "javascript");\n  }\n\n  return (\n    <>\n      <button onClick={toggleTheme} disabled={!isEditorReady}>\n        Toggle theme\n      </button>\n      <button onClick={toggleLanguage} disabled={!isEditorReady}>\n        Toggle language\n      </button>\n\n      <Editor\n        height={360} // By default, it fully fits with its parent\n        theme={theme}\n        language={language}\n        value={examples[language]}\n        editorDidMount={handleEditorDidMount}\n      />\n    </>\n  );\n}\n\nconst rootElement = document.getElementById("root");\nReactDOM.render(<App />, rootElement);`,
  json: '{\n  "port": 8080,\n  "exclude_from_auth": [\n    "/login",\n    "/check_token",\n    "/battles:get",\n    "/team"\n  ],\n  "db": {\n    "default_data": {\n      "battles": [],\n      "active_battle_id": null,\n      "admin": {},\n      "secret": "",\n      "active_tokens": []\n    },\n    "path": ".db.json"\n  },\n  "default_salt_rounds": 10,\n  "default_admin_password": "adminonaly",\n  "uws_server": {\n    "port": 9000,\n    "action_types": {\n      "BROADCAST": "BROADCAST",\n      "CREATE_BATTLE": "CREATE_BATTLE",\n      "SEND_CHALLENGE_ANSWER": "SEND_CHALLENGE_ANSWER",\n      "CREATE_TEAM": "CREATE_TEAM",\n      "DELETE_TEAM": "DELETE_TEAM",\n      "START_BATTLE": "START_BATTLE",\n      "FINISH_BATTLE": "FINISH_BATTLE",\n      "DELETE_BATTLE": "DELETE_BATTLE"\n    },\n    "child_process_parameters": []\n  },\n  "http_error_messages": {\n    "400": "Your request is bad, and you should feel bad.",\n    "401": "I don\'t know who you are, but I\'ll find you and login you.",\n    "403": "Here we store NASA top secret files, Forbidden.",\n    "404": "Oops! You tried to get something that does not exist in this universe.",\n    "406": "It\'s unacceptable!!! It\'s all over between us.",\n    "408": "This request took a century to process and didn\'t even finished.",\n    "500": "Our server is a little bit sad now, try again later.",\n    "503": "Our server is too tired now, try again after a short break."\n  },\n  "general_error_messages": {\n    "no_active": "No active battle.",\n    "not_started": "Battle hasn\'t started yet.",\n    "started": "Battle has already started.",\n    "finished": "Battle has already finished.",\n    "invalid_data": "Invalid Data.",\n    "no_data": "Data is not passed.",\n    "not_admin": "Our admin has all possible, 4 incredible and 2 impossible rights, but you aren\'t our admin.",\n    "challenge_not_started": "Can\'t submit unbegun battle challenges.",\n    "admin_challenge": "Admin can\'t solve challenges.",\n    "already_solved": "This challenge has already been solved by your team.",\n    "better_solution": "The previous vesrion of your team is better.",\n    "no_challenge": "There is no challenge mentioned by you!",\n    "auth_fail": "Authentication failed.",\n    "short_password": "Password should be at least 6 chars long."\n  }\n}',
  kotlin:
    'class MutableStack<E>(vararg items: E) {              // 1\n\n  private val elements = items.toMutableList()\n\n  fun push(element: E) = elements.add(element)        // 2\n\n  fun peek(): E = elements.last()                     // 3\n\n  fun pop(): E = elements.removeAt(elements.size - 1)\n\n  fun isEmpty() = elements.isEmpty()\n\n  fun size() = elements.size\n\n  override fun toString() = "MutableStack(${elements.joinToString()})"\n}',
  less: "@base: #f938ab;\n\n.box-shadow(@style, @c) when (iscolor(@c)) {\n  border-radius: @style @c;\n}\n\n.box-shadow(@style, @alpha: 50%) when (isnumber(@alpha)) {\n  .box-shadow(@style, rgba(0, 0, 0, @alpha));\n}\n\n.box { \n  color: saturate(@base, 5%);\n  border-color: lighten(@base, 30%);\n  \n  div {\n    .box-shadow((0 0 5px), 30%);\n  }\n}\n\n#header {\n  h1 {\n    font-size: 26px;\n    font-weight: bold;\n  }\n  \n  p { font-size: 12px;\n    a { text-decoration: none;\n      &:hover { border-width: 1px }\n    }\n  }\n}",
  lua: '-- defines a factorial function\nfunction fact (n)\n  if n == 0 then\n    return 1\n  else\n    return n * fact(n-1)\n  end\nend\n\nprint("enter a number:")\na = io.read("*number")        -- read a number\nprint(fact(a))',
  markdown:
    "## Primes\n\nIt's a playground for examining and playing with prime numbers. It also gives an opportunity to write custom formulas and visualize the results.\n\n### Demo\n\nYou can try it simply by opening this [link](https://primes.surenatoyan.com/)\n\n### Development\n\nYou also can set up it on your local machine for development (or other) purposes. For that you need:\n\n - [Nodejs](https://nodejs.org/en/)\n - npm (it comes with nodejs) - or [yarn](https://yarnpkg.com/en/)\n\nRun these commands to clone the repository, install dependencies and run the application.\n\n1) `git clone https://github.com/SurenAt93/primes.git`\n2) `cd primes`\n3) `npm install` (or if you are using yarn, just `yarn`)\n4) `npm run start` (or `yarn start` in case of yarn)\n\nThat's it. After, open `localhost:3000` in your browser.\nNote that by these steps you run the application in development mode. So, you can open the source of it in your preferred text editor and do whatever you want.\n\nTo make a production build after the third step run - `npm run build` (or `yarn build` in case of yarn). After a successful build, you will have a production ready app in the build folder.\n\n## License\n\n[MIT](./LICENSE)",
  msdax: " = CALCULATE(SUM(Sales[SalesAmount]), PREVIOUSQUARTER(Calendar[DateKey]))",
  mysql:
    "CREATE TABLE shop (\n  article INT(4) UNSIGNED ZEROFILL DEFAULT '0000' NOT NULL,\n  dealer  CHAR(20)                 DEFAULT ''     NOT NULL,\n  price   DOUBLE(16,2)             DEFAULT '0.00' NOT NULL,\n  PRIMARY KEY(article, dealer));\nINSERT INTO shop VALUES\n  (1,'A',3.45),(1,'B',3.99),(2,'A',10.99),(3,'B',1.45),\n  (3,'C',1.69),(3,'D',1.25),(4,'D',19.95);",
  "objective-c":
    '#import \n\nint foo() {\n  int a = 3 // exists in this function only\n  int b = 2 // exists in this function only\n  return c + d;\n}\n\nint main (int argc, const char * argv[]) {\n  NSAutoreleasePool * pool = [[NSAutoreleasePool alloc] init];\n\n  result = foo();\n  NSLog(@"a = %i", b); // illegal code\n  \n  [pool drain];\n\n  return 0;\n}',
  pascal:
    "program factorial;\n\nfunction fact(n: integer): longint;\nbegin\n  if (n = 0) then\n    fact := 1\n  else\n    fact := n * fact(n - 1);\nend;\n\nvar\n  n: integer;\n\nbegin\n  for n := 0 to 16 do\n      writeln(n, '! = ', fact(n));\nend.",
  perl: "#!/usr/bin/perl\nuse strict;\nuse warnings;\n\nuse Path::Tiny;\n\nmy $dir = path('foo','bar'); # foo/bar\n\n# Iterate over the content of foo/bar\nmy $iter = $dir->iterator;\nwhile (my $file = $iter->()) {\n\n  # See if it is a directory and skip\n  next if $file->is_dir();\n\n  # Print out the file name and path\n  print \"$file\n\";\n}",
  pgsql:
    "BEGIN\n  SELECT * INTO STRICT myrec FROM emp WHERE empname = myname;\n  EXCEPTION\n    WHEN NO_DATA_FOUND THEN\n      RAISE EXCEPTION 'employee % not found', myname;\n    WHEN TOO_MANY_ROWS THEN\n      RAISE EXCEPTION 'employee % not unique', myname;\nEND;",
  php: '<!DOCTYPE html>\n<html>\n<body>\n\n<h1>PHP example</h1>\n\n<?php\n  echo "Hello World!";\n?>\n\n</body>\n</html>',
  plaintext:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec cursus aliquet sapien, sed rhoncus leo ullamcorper ornare. Interdum et malesuada fames ac ante ipsum primis in faucibus. Phasellus feugiat eleifend nisl, aliquet rhoncus quam scelerisque vel. Morbi eu pellentesque ex. Nam suscipit maximus leo blandit cursus. Aenean sollicitudin nisi luctus, ornare nibh viverra, laoreet ex. Donec eget nibh sit amet dolor ornare elementum. Morbi sollicitudin enim vitae risus pretium vestibulum. Ut pretium hendrerit libero, non vulputate ante volutpat et. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nullam malesuada turpis vitae est porttitor, id tincidunt neque dignissim. Integer rhoncus vestibulum justo in iaculis. Praesent nec augue ut dui scelerisque gravida vel id velit. Donec vehicula feugiat mollis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.\n\nPraesent diam lorem, luctus quis ullamcorper non, consequat quis orci. Ut vel massa vel nunc sagittis porttitor a vitae ante. Quisque euismod lobortis imperdiet. Vestibulum tincidunt vehicula posuere. Nulla facilisi. Donec sodales imperdiet risus id ullamcorper. Nulla luctus orci tortor, vitae tincidunt urna aliquet nec. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Etiam consequat dapibus massa. Sed ac pharetra magna, in imperdiet neque. Nullam nunc nisi, consequat vel nunc et, sagittis aliquam arcu. Aliquam non orci magna. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Sed id sem ut sem pulvinar rhoncus. Aenean venenatis nunc eget mi ornare, vitae maximus lacus varius. Quisque quis vestibulum justo.\n\nDonec euismod luctus volutpat. Donec sed lacinia enim. Vivamus aliquam elit cursus, convallis diam at, volutpat turpis. Sed lacinia nisl in auctor dapibus. Nunc turpis mi, mattis ut rhoncus id, lacinia sed lectus. Donec sodales tellus quis libero gravida pretium et quis magna. Etiam ultricies mollis purus, eget consequat velit. Duis vitae nibh vitae arcu tincidunt congue. Maecenas ut velit in ipsum condimentum dictum quis eget urna. Sed mattis nulla arcu, vitae mattis ligula dictum at.",
  postiats:
    '// http://www.ats-lang.org/\n(* Say Hello! once *)\nval () = print"Hello!\n"\n//\n(* Say Hello! 3 times *)\nval () = 3*delay(print"Hello!")\nval () = print_newline((*void*))\n//\n\n//\n(* Build a list of 3 *)\nval xs = $list{int}(0, 1, 2)\n//\nval x0 = xs[0] // legal\nval x1 = xs[1] // legal\nval x2 = xs[2] // legal\nval x3 = xs[3] // illegal',
  powerquery:
    'let\n  Source = Excel.CurrentWorkbook(){[Name="Table1"]}[Content],\n  SplitColumnDelimiter = Table.SplitColumn(Source,"Input",Splitter.SplitTextByDelimiter(","),13),\n  Unpivot = Table.Unpivot(SplitColumnDelimiter,{"Input.1", "Input.2", "Input.3", "Input.4",\n  "Input.5", "Input.6",    "Input.7", "Input.8", "Input.9", "Input.10", "Input.11", "Input.12"\n  ,  "Input.13"},"Attribute","Value"),\n  RemovedColumns = Table.RemoveColumns(Unpivot,{"Attribute"}),\n  DuplicatesRemoved = Table.Distinct(RemovedColumns),\n  GroupedRows = Table.Group(DuplicatesRemoved, {"RowID"}, {{"Count of Distinct Values"\n  , each Table.RowCount(_), type number}})\nin\n  GroupedRows',
  powershell:
    '# Convert any text file to ASCII\n \nparam( [string] $infile = $(throw "Please specify a filename.") )\n \n$outfile = "$infile.ascii"\n \nget-content -path $infile | out-file $outfile -encoding ascii',
  pug: "doctype 5\nhtml(lang=\"en\")\n  head\n    title= pageTitle\n    script(type='text/javascript')\n      if (foo) {\n        bar()\n      }\n  body\n    // Disclaimer: You will need to turn insertSpaces to true in order for the\n      syntax highlighting to kick in properly (especially for comments)\n      Enjoy :)\n    h1 Pug - node template engine\n    #container\n      if youAreUsingPug\n        p You are amazing\n      else\n        p Get on it!",
  python:
    '# Python program to check if the number provided by the user is an Armstrong number or not\n# take input from the user\nnum = int(input("Enter a number: "))\n# initialize sum\nsum = 0\n# find the sum of the cube of each digit\ntemp = num\nwhile temp > 0:\n   digit = temp % 10\n   sum += digit ** 3\n   temp //= 10\n# display the result\nif num == sum:\n   print(num,"is an Armstrong number")\nelse:\n   print(num,"is not an Armstrong number")',
  r: "# Program to convert decimal number into binary number using recursive function\nconvert_to_binary <- function(n) {\n  if(n > 1) {\n    convert_to_binary(as.integer(n/2))\n  }\n  cat(n %% 2)\n}",
  razor:
    '@{\n  var total = 0;\n  var totalMessage = "";\n  @* a multiline\n    razor comment embedded in csharp *@\n  if (IsPost) {\n    // Retrieve the numbers that the user entered.\n    var num1 = Request["text1"];\n    var num2 = Request["text2"];\n\n    // Convert the entered strings into integers numbers and add.\n    total = num1.AsInt() + num2.AsInt();\n  <italic><bold>totalMessage = "Total = " + total;</bold></italic>\n  }\n}\n\n<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <title>Add Numbers</title>\n    <meta charset="utf-8" />\n  </head>\n<body>\n  <p>Enter two whole numbers and then click <strong>Add</strong>.</p>\n  <form action="" method="post">\n    <p><label for="text1">First Number:</label>\n      <input type="text" name="text1" />\n    </p>\n    <p><label for="text2">Second Number:</label>\n      <input type="text" name="text2" />\n    </p>\n    <p><input type="submit" value="Add" /></p>\n  </form>\n\n  @* now we call the totalMessage method \n     (a multi line razor comment outside code) *@\n\n  <p>@totalMessage</p>\n  \n  <p>@(totalMessage+"!")</p>\n  \n  An email address (with escaped at character): name@@domain.com\n \n</body>\n</html>',
  redis: 'EXISTS xkey\nAPPEND xkey "Hello"\nAPPEND xkey " World"\nGET xkey',
  redshift:
    "create view tables_vw as\nselect distinct(id) table_id\n,trim(datname)   db_name\n,trim(nspname)   schema_name\n,trim(relname)   table_name\nfrom stv_tbl_perm\njoin pg_class on pg_class.oid = stv_tbl_perm.id\njoin pg_namespace on pg_namespace.oid = relnamespace\njoin pg_database on pg_database.oid = stv_tbl_perm.db_id;",
  ruby: "def find_missing(sequence)\n  consecutive     = sequence.each_cons(2)\n  differences     = consecutive.map { |a,b| b - a }\n  sequence        = differences.max_by { |n| differences.count(n) }\n  missing_between = consecutive.find { |a,b| (b - a) != sequence }\n  missing_between.first + sequence\nend\nfind_missing([2,4,6,10])\n# 8",
  rust: 'struct Sheep { naked: bool, name: &\'static str }\n\ntrait Animal {\n  // Static method signature; `Self` refers to the implementor type.\n  fn new(name: &\'static str) -> Self;\n\n  // Instance method signatures; these will return a string.\n  fn name(&self) -> &\'static str;\n  fn noise(&self) -> &\'static str;\n\n  // Traits can provide default method definitions.\n  fn talk(&self) {\n    println!("{} says {}", self.name(), self.noise());\n  }\n}\n\nimpl Sheep {\n  fn is_naked(&self) -> bool {\n    self.naked\n  }\n\n  fn shear(&mut self) {\n    if self.is_naked() {\n      // Implementor methods can use the implementor\'s trait methods.\n      println!("{} is already naked...", self.name());\n    } else {\n      println!("{} gets a haircut!", self.name);\n\n      self.naked = true;\n    }\n  }\n}\n\n// Implement the `Animal` trait for `Sheep`.\nimpl Animal for Sheep {\n  // `Self` is the implementor type: `Sheep`.\n  fn new(name: &\'static str) -> Sheep {\n    Sheep { name: name, naked: false }\n  }\n\n  fn name(&self) -> &\'static str {\n    self.name\n  }\n\n  fn noise(&self) -> &\'static str {\n    if self.is_naked() {\n      "baaaaah?"\n    } else {\n      "baaaaah!"\n    }\n  }\n  \n  // Default trait methods can be overridden.\n  fn talk(&self) {\n    // For example, we can add some quiet contemplation.\n    println!("{} pauses briefly... {}", self.name, self.noise());\n  }\n}\n\nfn main() {\n  // Type annotation is necessary in this case.\n  let mut dolly: Sheep = Animal::new("Dolly");\n  // TODO ^ Try removing the type annotations.\n\n  dolly.talk();\n  dolly.shear();\n  dolly.talk();\n}',
  sb: 'begin:\nTextWindow.Write("Enter a number: ")\nnum = TextWindow.ReadNumber()\nremainder = Math.Remainder(num, 2)\nIf (remainder = 0) Then\n TextWindow.WriteLine("The number is Even")\nElse\n TextWindow.WriteLine("The number is Odd")\nEndIf\nGoto begin',
  scheme:
    ";;; make-matrix creates a matrix (a vector of vectors).\n(define make-matrix\n  (lambda (rows columns)\n    (do ((m (make-vector rows))\n         (i 0 (+ i 1)))\n        ((= i rows) m)\n        (vector-set! m i (make-vector columns)))))\n\n;;; matrix? checks to see if its argument is a matrix.\n;;; It isn't foolproof, but it's generally good enough.\n(define matrix?\n  (lambda (x)\n    (and (vector? x)\n         (> (vector-length x) 0)\n         (vector? (vector-ref x 0)))))\n\n;; matrix-rows returns the number of rows in a matrix.\n(define matrix-rows\n   (lambda (x)\n      (vector-length x)))\n\n;; matrix-columns returns the number of columns in a matrix.\n(define matrix-columns\n   (lambda (x)\n      (vector-length (vector-ref x 0))))\n\n;;; matrix-ref returns the jth element of the ith row.\n(define matrix-ref\n  (lambda (m i j)\n    (vector-ref (vector-ref m i) j)))\n\n;;; matrix-set! changes the jth element of the ith row.\n(define matrix-set!\n  (lambda (m i j x)\n    (vector-set! (vector-ref m i) j x)))\n\n;;; mul is the generic matrix/scalar multiplication procedure\n(define mul\n  (lambda (x y)\n    ;; mat-sca-mul multiplies a matrix by a scalar.\n    (define mat-sca-mul\n       (lambda (m x)\n          (let* ((nr (matrix-rows m))\n                 (nc (matrix-columns m))\n                 (r  (make-matrix nr nc)))\n             (do ((i 0 (+ i 1)))\n                 ((= i nr) r)\n                 (do ((j 0 (+ j 1)))\n                     ((= j nc))\n                     (matrix-set! r i j\n                        (* x (matrix-ref m i j))))))))\n\n    ;; mat-mat-mul multiplies one matrix by another, after verifying\n    ;; that the first matrix has as many columns as the second\n    ;; matrix has rows.\n    (define mat-mat-mul\n       (lambda (m1 m2)\n          (let* ((nr1 (matrix-rows m1))\n                 (nr2 (matrix-rows m2))\n                 (nc2 (matrix-columns m2))\n                 (r   (make-matrix nr1 nc2)))\n             (if (not (= (matrix-columns m1) nr2))\n                 (match-error m1 m2))\n             (do ((i 0 (+ i 1)))\n                 ((= i nr1) r)\n                 (do ((j 0 (+ j 1)))\n                     ((= j nc2))\n                     (do ((k 0 (+ k 1))\n                          (a 0\n                             (+ a\n                                (* (matrix-ref m1 i k)\n                                   (matrix-ref m2 k j)))))\n                         ((= k nr2)\n                          (matrix-set! r i j a))))))))\n\n   ;; type-error is called to complain when mul receives an invalid\n   ;; type of argument.\n    (define type-error\n       (lambda (what)\n          (error 'mul\n             \"~s is not a number or matrix\"\n             what)))\n\n    ;; match-error is called to complain when mul receives a pair of\n    ;; incompatible arguments.\n    (define match-error\n       (lambda (what1 what2)\n          (error 'mul\n             \"~s and ~s are incompatible operands\"\n             what1\n             what2)))\n\n    ;; body of mul; dispatch based on input types\n    (cond\n      ((number? x)\n       (cond\n         ((number? y) (* x y))\n         ((matrix? y) (mat-sca-mul y x))\n         (else (type-error y))))\n      ((matrix? x)\n       (cond\n         ((number? y) (mat-sca-mul x y))\n         ((matrix? y) (mat-mat-mul x y))\n         (else (type-error y))))\n      (else (type-error x)))))",
  scss: "$baseFontSizeInPixels: 14;\n\n@function px2em ($font_size, $base_font_size: $baseFontSizeInPixels) {  \n  @return ($font_size / $base_font_size) + em; \n}\n\nh1 {\n  font-size: px2em(36, $baseFontSizeInPixels);\n}\nh2  {\n  font-size: px2em(28, $baseFontSizeInPixels);\n}\n.class {\n  font-size: px2em(14, $baseFontSizeInPixels);\n}\n\nnav {\n  ul {\n    margin: 0;\n    padding: 0;\n    list-style: none;\n  }\n\n  li { display: inline-block; }\n\n  a {\n    display: block;\n    padding: 6px 12px;\n    text-decoration: none;\n  }\n  \n  @each $animal in puma, sea-slug, egret, salamander {\n    .#{$animal}-icon {\n      background-image: url('/images/#{$animal}.png');\n    }\n  }\n}",
  shell:
    '#!/usr/bin/env bash\n#\n# Turn the single document bible into a book separated by chapters.\n\nmain() {\n    rm -rf manuscript\n    mkdir -p manuscript\n\n    # Split the README.md into chapters based on markers.\n    while IFS=$\'\n\' read -r line; do\n        [[ "$chap" ]] && chapter[$i]+="$line"$\'\n\'\n        [[ "$line" == "<!-- CHAPTER START -->" ]] && chap=1\n        [[ "$line" == "<!-- CHAPTER END -->" ]]   && { chap=; ((i++)); }\n    done < README.md\n\n    # Write the chapters to separate files.\n    for i in "${!chapter[@]}"; do\n        : "${chapter[$i]/$\'\n\'*}"; : "${_/# }"; : "${_,,}"\n        printf \'%s\n\' "${chapter[$i]}" > "manuscript/chapter${i}.txt"\n        printf \'%s\n\' "chapter${i}.txt" >> "manuscript/Book.txt"\n    done\n}\n\nmain',
  sol: '#ifndef EXAMPLES_ASSERT_HPP\n#define EXAMPLES_ASSERT_HPP\n\n# define m_assert(condition, message)\n  do {\n    if (! (condition)) {\n      std::cerr << "Assertion `" #condition "` failed in " << __FILE__\n                << " line " << __LINE__ << ": " << message << std::endl;\n      std::terminate();\n    }\n  } while (false)\n\n# define c_assert(condition)\n    do {\n      if (! (condition)) {\n        std::cerr << "Assertion `" #condition "` failed in " << __FILE__\n                  << " line " << __LINE__ << std::endl;\n        std::terminate();\n      }\n    } while (false)\n#else\n#   define m_assert(condition, message) do { if (false) { (void)(condition); (void)sizeof(message); } } while (false)\n#   define c_assert(condition) do { if (false) { (void)(condition); } } while (false)\n#endif\n\n#endif // EXAMPLES_ASSERT_HPP',
  sql: "CREATE VIEW Failing_Students AS\nSELECT S_NAME, Student_ID\nFROM STUDENT\nWHERE GPA > 40;",
  st: "FUNCTION_BLOCK SubFB\nVAR_INPUT\nTimeIN : BOOL; (* Boolean input variable *)\nTimeQ : BOOL; (* Boolean input variable *)\nEND_VAR\nVAR_IN_OUT\nTimer : TON; (* pointer to instance Time1 of TON – input/output variable *)\nEND_VAR\nVAR_OUTPUT\nTime3 : TON; (* 3rd instance of TON *)\nEND_VAR\nVAR\nStart : BOOL := TRUE; (* local Boolean variable *)\nEND_VAR",
  swift:
    'if let bestPlayer = players.highestScoringPlayer() {\n  recordHolder = """\n    The record holder is (bestPlayer.name),        with a high score of (bestPlayer.highScore)!\n  """\n} else {\n  recordHolder = "No games have been played yet.")\n}\nprint(recordHolder)\n// The record holder is Erin, with a high score of 271!\n\nlet highestScore = players.highestScoringPlayer()?.highScore ?? 0\n// highestScore == 271',
  tcl: "#!/usr/bin/tclsh\n\nset variableA 10\nset {variable B} test\nputs $variableA\nputs ${variable B}",
  typescript:
    "import * as React from 'react';\nimport { StandardProps } from '..';\nimport { TypographyProps } from '../Typography';\n\nexport interface ListItemTextProps\n  extends StandardProps<React.HTMLAttributes<HTMLDivElement>, ListItemTextClassKey> {\n  disableTypography?: boolean;\n  inset?: boolean;\n  primary?: React.ReactNode;\n  primaryTypographyProps?: Partial<TypographyProps>;\n  secondary?: React.ReactNode;\n  secondaryTypographyProps?: Partial<TypographyProps>;\n}\n\nexport type ListItemTextClassKey =\n  | 'root'\n  | 'multiline'\n  | 'dense'\n  | 'inset'\n  | 'primary'\n  | 'secondary';\n\ndeclare const ListItemText: React.ComponentType<ListItemTextProps>;\n\nexport default ListItemText;",
  vb: 'Imports System\nImports System.Collections.Generic\n\nModule Module1\n\n    Sub Main()\n        Dim a As New M8Ball\n\n        Do While True\n\n            Dim q As String = ""\n            Console.Write("ask me about the future... ")\n            q = Console.ReadLine()\n\n            If q.Trim <> "" Then\n                Console.WriteLine("the answer is... {0}", a.getAnswer(q))\n            Else\n                Exit Do\n            End If\n        Loop\n\n    End Sub\n\nEnd Module',
  xml: '<?xml version="1.0" encoding="ISO-8859-1"?>  \n<note>  \n  <to>Tove</to>  \n  <from>Jani</from>  \n  <heading>Reminder</heading>  \n  <body>Don\'t forget me this weekend!</body>  \n</note>',
  yaml: "%TAG ! tag:clarkevans.com,2002:\n--- !shape\n  # Use the ! handle for presenting\n  # tag:clarkevans.com,2002:circle\n- !circle\n  center: &ORIGIN {x: 73, y: 129}\n  radius: 7\n- !line\n  start: *ORIGIN\n  finish: { x: 89, y: 102 }\n- !label\n  start: *ORIGIN\n  color: 0xFFEEBB\n  text: Pretty vector drawing.",
};

// diff examples
const diffExamples: {
  [key: string]: any;
} = {
  original: `<!-- logo -->
<p align="center" style="padding-top: 40px">
  <img src="./assets/images/logo.svg?sanitize=true" width="120" alt="logo" />
</p>
<!-- logo -->

<!-- title -->
<h1 align="center" style="text-align: center">monaco-editor-react</h1>
<!-- title -->


[Monaco Editor](https://microsoft.github.io/monaco-editor/) for [React](https://reactjs.org/)


---

## Installing

\`\`\`javascript

$ yarn add @lyove/monaco-editor-react

\`\`\`

## Example

\`\`\`javascript

import React from 'react';
import examples from './examples'
import MonacoEditor from '@lyove/monaco-editor-react'


class Index extends React.Component {
  render() {
    return (
      <div style={{ padding: '20px' }}>
        <h2>Monaco Editor base example</h2>
        <MonacoEditor
          width={800}
          height={500}
          language="javascript"
          value={examples['javascript']}
          onChange={(value) => {
            console.log('editor value: ', value)
          }}
          editorDidMount={(editor, monaco) => {
            console.log("editor instance: ", editor)
            console.log("monaco: ", monaco)
          }}
        />
      </div>
    )
  }
}


export default Index
\`\`\`

## Development

> To build the example locally, run:

\`\`\`javascript

git clone https://github.com/lyove/monaco-editor-react.git

cd monaco-editor-react

yarn install

yarn start

\`\`\`

---

## Monaco Editor

### Props

| Name | Type | Default | Description |
|:--------------|:-------------|:-------------|:---------------|
| value | string | null | editor value |
| width | number | 100% | null | editor width |
| height | number | 100% | null | editor height |
| language | string | null | editor language |
| theme | string | vs | vs, vs-dark, active4d, clouds, chrome, monokai, solarized-dark, solarized-light |
| options | object | null | [IEditorOptions](https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.ieditoroptions.html) |
| style | object | null | editor outer container style |
| onChange | func | (value) => void | triggered when the editor value changes |
| monacoWillMount | func | (monaco) => void | triggered when the monaco will mounted |
| editorDidMount | func | (editor, monaco) => void | triggered when the editor did mounted |


## Diff Editor

### Props

| Name | Type | Default | Description |
|:--------------|:-------------|:-------------|:---------------|
| original | string | null | diff editor original value |
| modified | string | null | diff editor modified value |
| width | number | 100% | null | diff editor width |
| height | number | 100% | null | diff editor height |
| language | string | null | diff editor language |
| originalLanguage | string | null | diff editor original language |
| modifiedLanguage | string | null | diff editor modified language |
| theme | string | vs | vs, vs-dark, active4d, clouds, chrome, monokai, solarized-dark, solarized-light |
| options | object | null | [IDiffEditorOptions](https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.idiffeditorconstructionoptions.html) |
| style | object | null | diff editor outer container style |
| monacoWillMount | func | (monaco) => void | triggered when the monaco will mounted |
| editorDidMount | func | (original: (value) => void, modified: (value: string) => void, editor) => void | triggered when the diff editor did mounted |
  `,
  modified: `<!-- logo -->
<p align="center" style="padding-top: 40px">
  <img src="./assets/images/logo.svg?sanitize=true" width="120" alt="logo" />
</p>
<!-- logo -->

<!-- title -->
<h1 align="center" style="text-align: center">monaco-diff-editor-react</h1>
<!-- title -->


[Monaco Editor](https://microsoft.github.io/monaco-editor/) for [React](https://reactjs.org/)


---

## Installing

\`\`\`javascript

$ yarn add @lyove/monaco-editor-react

\`\`\`

## Example

\`\`\`javascript

import React from 'react';
import examples from './examples'
import MonacoEditor from '@lyove/monaco-editor-react'


class Index extends React.Component {
  render() {
    return (
      <div style={{ padding: '20px' }}>
        <h2>Monaco Editor base example</h2>
        <MonacoEditor
          width={800}
          height={500}
          language="javascript"
          value={examples['javascript']}
          onChange={(value) => {
            console.log('editor value: ', value)
          }}
          editorDidMount={(editor, monaco) => {
            console.log("editor instance: ", editor)
            console.log("monaco: ", monaco)
          }}
        />
      </div>
    )
  }
}


export default Index
\`\`\`

## Development

> To build the example locally, run:

\`\`\`javascript

git clone https://github.com/lyove/monaco-editor-react.git

cd monaco-editor-react

yarn install

yarn start

\`\`\`

---

## Monaco Editor

### Props

| Name | Type | Default | Description |
|:--------------|:-------------|:-------------|:---------------|
| value | string | null | editor value |
| width | number | 100% | null | editor width |
| height | number | 100% | null | editor height |
| language | string | null | editor language |
| theme | string | vs | vs, vs-dark, active4d, clouds, chrome, monokai, solarized-dark, solarized-light |
| options | object | null | [IEditorOptions](https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.ieditoroptions.html) |
| style | object | null | editor outer container style |
| onChange | func | (value) => void | triggered when the editor value changes |
| monacoWillMount | func | (monaco) => void | triggered when the monaco will mounted |
| editorDidMount | func | (editor, monaco) => void | triggered when the editor did mounted |


## Diff Editor

### Props

| Name | Type | Default | Description |
|:--------------|:-------------|:-------------|:---------------|
| original | string | null | diff editor original value |
| modified | string | null | diff editor modified value |
| width | number | 100% | null | diff editor width |
| height | number | 100% | null | diff editor height |
| language | string | null | diff editor language |
| originalLanguage | string | null | diff editor original language |
| modifiedLanguage | string | null | diff editor modified language |
| theme | string | vs | vs, vs-dark, active4d, clouds, chrome, monokai, solarized-dark, solarized-light |
| options | object | null | [IDiffEditorOptions](https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.idiffeditorconstructionoptions.html) |
| style | object | null | diff editor outer container style |
| monacoWillMount | func | (monaco) => void | triggered when the monaco will mounted |
| editorDidMount | func | (original: (value) => void, modified: (value: string) => void, editor) => void | triggered when the diff editor did mounted |
  `,
};

export { examples, diffExamples };
