Ever needed to create a PDF that includes code snippets together with their
outputs? Spent too much time running the scripts and copying their outputs into
your tex document? No more of that! `doc-builder` automates the process by
running your scripts, adding their outputs to your tex file and compiling the
result into a nice PDF.

Requirements: Node.js, `pdflatex`

To build the PDF, run `node build.js`.
[TODO:] decide how to handle solutions
[TODO:] receive main tex file as input

`public-sources/` contains scripts that, together with their output, may appear
in the PDF. They are run by the build script `build.js` every time before the
PDF compilation and their output is saved temporarily. We provide the following
LaTeX macros to import specific files:
* `\getenv[\sourcepath]{<script-name>}` assigns the actual file path of
  `<script-name>` to the LaTeX macro `\sourcepath`.
* `\codelisting{\sourcepath}` puts the source code verbatim in the PDF.
* `\outputlisting{\sourcepath}` puts the output of the source code in the PDF.
* `\solution{<script-name>}` automates the formatting of source code and
  its output in a "Solution" box, useful if you're creating versions with and
  without solutions (e.g. for an exercise). To enable this macro, run `node
  build.js --with-solutions`.

`private-sources/` contains all non-LaTeX supporting code that does not appear
in the PDF, e.g. a script that creates some random data to be consumed by a
script in `public-sources/`.

[TODO:] implement toposort and provide nice API, e.g. YAML file of deps
[TODO:] allow arbitrary directories, as specified in the dependency file, or
`scripts/` dir for those who don't bother with the dep file

As far as LaTeX is concerned, all PDF contents are in `main.tex`. Command
definitions and package declarations are in `preamble.sty`.

[TODO:] allow arbitrary tex file structures
