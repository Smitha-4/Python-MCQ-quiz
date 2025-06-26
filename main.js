// Get references to elements
// Get references to elements
const instructionsScreen = document.getElementById('instructions-screen');
const startQuizBtn = document.getElementById('start-quiz-btn');
const quizContainer = document.getElementById('quiz-container');
const nextButton = document.getElementById('next-btn'); // Correctly linked to the HTML button
const submitBtn = document.getElementById('submit-btn'); // This button is largely superseded by nextButton for submission logic
const resultElement = document.getElementById('result'); // For temporary messages (e.g., "Please select an answer")
const restartBtn = document.getElementById('restart-btn');

// New elements needed for your scoring/results display (dynamically created if not in HTML)
// Let's ensure these are correctly linked to or created.
// For simplicity, let's create them if they don't exist in HTML
let scoreSection = document.getElementById('score-section');
let finalScoreSpan;
let scoreDetailsParagraph;

if (!scoreSection) {
    scoreSection = document.createElement('div');
    scoreSection.id = 'score-section';
    scoreSection.innerHTML = '<h3>Your Score: <span id="final-score"></span></h3><p id="score-details"></p>';
    // Append it to the body or a suitable parent, e.g., the container div
    document.querySelector('.container').appendChild(scoreSection);
    scoreSection.style.display = 'none'; // Initially hide score section
}
finalScoreSpan = document.getElementById('final-score');
scoreDetailsParagraph = document.getElementById('score-details');


let currentQuestionIndex = 0;
let userAnswers = [];  // Array to store user's selected option index for each questio // To store the selected option index for each question

// ALL QUIZ QUESTIONS EMBEDDED DIRECTLY IN JAVASCRIPT
const quizData = [
    {
        "question": "What are the fundamental purposes of variables, loops, and conditionals in Python programming?",
        "answer_options": [
            { "text": "Variables are used to store data, loops execute code repeatedly, and conditionals execute code based on conditions.", "rationale": "This accurately defines the purpose of variables, loops, and conditionals in programming.", "is_correct": true },
            { "text": "Variables control program flow, loops define functions, and conditionals store temporary data.", "rationale": "This statement incorrectly describes the primary roles of these programming constructs.", "is_correct": false },
            { "text": "Variables manage memory, loops optimize algorithms, and conditionals handle errors.", "rationale": "While related, these are not the most direct or complete definitions of variables, loops, and conditionals.", "is_correct": false },
            { "text": "Variables create objects, loops manage classes, and conditionals implement inheritance.", "rationale": "These concepts are related to object-oriented programming, not the fundamental definitions of variables, loops, and conditionals.", "is_correct": false }
        ]
    },
    
    {
        "question": "Differentiate between a `for` loop and a `while` loop in Python, providing a common use case for each.",
        "answer_options": [
            { "text": "A `for` loop iterates over a sequence (like a list or string), and a `while` loop continues as long as a condition is true.", "rationale": "This accurately distinguishes between iteration over sequences and condition-based repetition.", "is_correct": true },
            { "text": "A `for` loop is used for infinite loops, and a `while` loop is for definite iterations.", "rationale": "This is incorrect; `while` loops can create infinite loops, and `for` loops are for definite iterations.", "is_correct": false },
            { "text": "They are interchangeable; both are used for indefinite iteration.", "rationale": "This is incorrect; `for` loops are typically for definite iteration and `while` for indefinite.", "is_correct": false },
            { "text": "A `for` loop executes once, and a `while` loop executes until explicitly stopped by the user.", "rationale": "This is incorrect; both can execute multiple times, and stopping a `while` loop is usually handled within the code.", "is_correct": false }
        ]
    },
    {
        "question": "Explain the scope of a variable declared inside a `for` loop or `while` loop in Python.",
        "answer_options": [
            { "text": "It ensures the variable is only accessible within the loop.", "rationale": "This is incorrect; variables defined within a loop typically retain their value after the loop finishes unless explicitly restricted.", "is_correct": false },
            { "text": "It prevents the variable from being reassigned outside the loop.", "rationale": "This is incorrect; Python does not have a built-in mechanism to prevent reassignment this way within a standard loop construct.", "is_correct": false },
            { "text": "It has no special scope; the variable is generally accessible outside the loop unless a function is involved.", "rationale": "Variables defined within a loop in Python typically have a scope that extends beyond the loop itself, unless the loop is inside a function.", "is_correct": true },
            { "text": "It creates a new memory address for the variable on each iteration.", "rationale": "While the value might change, the variable name itself points to different objects, but its scope isn't limited by this.", "is_correct": false }
        ]
    },

    {
        "question": "Explain the functionality of the `else` block when used with a `for` loop or `while` loop in Python.",
        "answer_options": [
            { "text": "It is executed only if the loop completes without encountering a `break` statement.", "rationale": "This is the correct behavior of the `else` block in `for` and `while` loops.", "is_correct": true },
            { "text": "It is executed after every iteration of the loop.", "rationale": "This is incorrect; the `else` block is executed only once, after the loop finishes normally.", "is_correct": false },
            { "text": "It is executed if an error occurs within the loop.", "rationale": "This is incorrect; error handling is typically done with `try-except` blocks.", "is_correct": false },
            { "text": "It is executed before the loop begins.", "rationale": "This is incorrect; the `else` block is associated with the loop's completion, not its initiation.", "is_correct": false }
        ]
    },
    {
        "question": "What is the purpose of the `pass` statement, particularly in the context of conditional statements or loops?",
        "answer_options": [
            { "text": "It causes an infinite loop.", "rationale": "This is incorrect; the `pass` statement does nothing.", "is_correct": false },
            { "text": "It acts as a placeholder when a statement is syntactically required but you don't want any code to execute.", "rationale": "The `pass` statement is a null operation; nothing happens when it is executed.", "is_correct": true },
            { "text": "It immediately exits the loop.", "rationale": "This is incorrect; `pass` does not affect loop control flow.", "is_correct": false },
            { "text": "It skips the current iteration of the loop.", "rationale": "This is incorrect; `continue` skips the current iteration.", "is_correct": false }
        ]
    },
    {
        "question": "Explain the roles of `if`, `elif`, and `else` in Python's conditional statements.",
        "answer_options": [
            { "text": "`if` evaluates a single condition, `elif` provides additional conditions if `if` is false, and `else` executes if no preceding conditions are true.", "rationale": "This correctly defines the roles of `if`, `elif`, and `else` in conditional statements.", "is_correct": true },
            { "text": "It will raise an error and stop execution.", "rationale": "Error messages are crucial for debugging and should not be ignored.", "is_correct": false },
            { "text": "`if` executes always, `elif` only if there's an error, and `else` is for default values.", "rationale": "This is incorrect; their execution depends on conditions, not errors or defaults.", "is_correct": false },
            { "text": "`if` is for loops, `elif` for functions, and `else` for variables.", "rationale": "This is incorrect; they are used for conditional execution, not specific programming constructs.", "is_correct": false }
        ]
    },
    {
        "question": "What is the primary function of logical operators (`and`, `or`, `not`) in Python's conditional expressions?",
        "answer_options": [
            { "text": "They are used to combine conditional statements (e.g., AND, OR, NOT).", "rationale": "Logical operators like `and`, `or`, and `not` are used to combine and modify boolean expressions.", "is_correct": true },
            { "text": "They perform arithmetic operations on numbers.", "rationale": "Arithmetic operators like `+`, `-`, `*`, `/` perform arithmetic operations.", "is_correct": false },
            { "text": "They compare values (e.g., greater than, less than).", "rationale": "Comparison operators like `>`, `<`, `==` compare values.", "is_correct": false },
            { "text": "They assign values to variables.", "rationale": "The assignment operator `=` assigns values.", "is_correct": false }
        ]
    },
    {
        "question": "What is a function in Python, and what are its main benefits?",
        "answer_options": [
            { "text": "A function is a block of organized, reusable code that performs a single, related action.", "rationale": "This definition accurately describes the purpose and characteristics of a function.", "is_correct": true },
            { "text": "A function is a variable that stores multiple values.", "rationale": "This is incorrect; variables store values, but a function is a callable block of code.", "is_correct": false },
            { "text": "A function is a data type used for storing sequences.", "rationale": "This is incorrect; data types like lists or tuples store sequences, not functions.", "is_correct": false },
            { "text": "A function is a loop that executes code repeatedly.", "rationale": "This is incorrect; loops execute code repeatedly, but functions are defined blocks of code.", "is_correct": false }
        ]
    },
    {
        "question": "Explain the difference between positional arguments and keyword arguments when calling a Python function.",
        "answer_options": [
            { "text": "Positional arguments are matched by their order, keyword arguments by their name.", "rationale": "This accurately distinguishes between how positional and keyword arguments are passed and matched.", "is_correct": true },
            { "text": "Positional arguments are optional, while keyword arguments are mandatory.", "rationale": "This is incorrect; either can be optional or mandatory depending on their definition and default values.", "is_correct": false },
            { "text": "Keyword arguments can only be used with built-in functions.", "rationale": "This is incorrect; keyword arguments can be used with any Python function.", "is_correct": false },
            { "text": "Positional arguments require explicit type declarations.", "rationale": "This is incorrect; Python is dynamically typed and doesn't require explicit type declarations for arguments.", "is_correct": false }
        ]
    },
    {
        "question": "What is the purpose of `*args` and `**kwargs` in Python function definitions?",
        "answer_options": [
            { "text": "`*args` collects positional arguments into a tuple, and `**kwargs` collects keyword arguments into a dictionary.", "rationale": "This correctly explains how `*args` and `**kwargs` are used to handle a variable number of arguments.", "is_correct": true },
            { "text": "`*args` is for mandatory arguments, `**kwargs` is for optional arguments.", "rationale": "This is incorrect; both are for variable numbers of arguments, not for mandatory/optional distinctions.", "is_correct": false },
            { "text": "`*args` allows any data type, while `**kwargs` only allows strings.", "rationale": "This is incorrect; both can accept various data types.", "is_correct": false },
            { "text": "`*args` and `**kwargs` are used for defining function names dynamically.", "rationale": "This is incorrect; they are for handling function arguments, not defining function names.", "is_correct": false }
        ]
    },
    {
        "question": "Describe the function of the `return` statement in a Python function.",
        "answer_options": [
            { "text": "It stops the function's execution and sends a value back to the caller.", "rationale": "The `return` statement exits the function and passes a value back to where the function was called.", "is_correct": true },
            { "text": "It prints a value to the console but continues function execution.", "rationale": "`print()` displays output but doesn't terminate function execution or pass a value back.", "is_correct": false },
            { "text": "It defines a new variable within the function.", "rationale": "Variable definition uses the assignment operator, not `return`.", "is_correct": false },
            { "text": "It causes an error if the function is called without arguments.", "rationale": "This is incorrect; `return` doesn't inherently cause argument-related errors.", "is_correct": false }
        ]
    },
    {
        "question": "Explain the concept of variable scope (Local vs. Global) within the context of Python functions.",
        "answer_options": [
            { "text": "It refers to the accessibility of variables in different parts of a program.", "rationale": "Scope determines where a variable can be accessed or modified within a program.", "is_correct": true },
            { "text": "It is a type of function that returns another function.", "rationale": "This describes a higher-order function, not scope.", "is_correct": false },
            { "text": "It is the order in which functions are defined in a script.", "rationale": "This describes function definition order, not variable accessibility.", "is_correct": false },
            { "text": "It is the maximum number of arguments a function can accept.", "rationale": "This relates to function signatures, not variable scope.", "is_correct": false }
        ]
    },
    {
        "question": "What is a lambda function in Python, and when would you typically use one?",
        "answer_options": [
            { "text": "It is an anonymous, single-expression function.", "rationale": "Lambda functions are small, anonymous functions defined with the `lambda` keyword.", "is_correct": true },
            { "text": "It is a function that can modify other functions.", "rationale": "This describes a decorator or higher-order function, not specifically a lambda.", "is_correct": false },
            { "text": "It is a function that requires a specific number of arguments.", "rationale": "This is not a defining characteristic of lambda functions.", "is_correct": false },
            { "text": "It is a function used for asynchronous programming.", "rationale": "Asynchronous programming often uses `async/await`, not primarily lambda functions.", "is_correct": false }
        ]
    },
    {
        "question": "How do default arguments work in Python functions, and why are they useful?",
        "answer_options": [
            { "text": "It specifies a value that will be used for a parameter if no argument is provided during the function call.", "rationale": "Default arguments provide a fallback value for parameters, making them optional during function calls.", "is_correct": true },
            { "text": "It makes the parameter mandatory.", "rationale": "Default arguments make parameters optional, not mandatory.", "is_correct": false },
            { "text": "It changes the data type of the parameter.", "rationale": "Default arguments do not change the parameter's data type.", "is_correct": false },
            { "text": "It limits the number of times a function can be called.", "rationale": "This describes function call limits, not default arguments.", "is_correct": false }
        ]
    },
    {
        "question": "What is a higher-order function in Python, and provide an example of its use.",
        "answer_options": [
            { "text": "A function that accepts other functions as arguments or returns a function as its result.", "rationale": "Higher-order functions are a core concept in functional programming, enabling more flexible and reusable code.", "is_correct": true },
            { "text": "A function with multiple `return` statements.", "rationale": "While a function can have multiple `return` statements, this doesn't define it as higher-order.", "is_correct": false },
            { "text": "A function that operates on objects and classes.", "rationale": "This describes methods in object-oriented programming, not higher-order functions in general.", "is_correct": false },
            { "text": "A function that interacts directly with the operating system.", "rationale": "This describes system-level functions, not higher-order functions.", "is_correct": false }
        ]
    },
    {
        "question": "Differentiate between the `append()` and `extend()` methods for Python lists.",
        "answer_options": [
            { "text": "`append()` adds a single element to the end, `extend()` adds all elements of an iterable to the end.", "rationale": "`append()` adds one item as a single element, while `extend()` iterates over an iterable and adds each of its elements.", "is_correct": true },
            { "text": "While related, these are not the most direct or complete definitions of variables, loops, and conditionals.", "rationale": "While related, these are not the most direct or complete definitions of variables, loops, and conditionals.", "is_correct": false },
            { "text": "`append()` modifies the original list, `extend()` creates a new list.", "rationale": "This is incorrect; both methods modify the original list in-place.", "is_correct": false },
            { "text": "`append()` is for integers, `extend()` for strings.", "rationale": "This is incorrect; both methods can handle various data types.", "is_correct": false }
        ]
    },
    {
        "question": "Explain the usage of `insert()` and `remove()` methods for Python lists.",
        "answer_options": [
            { "text": "`insert(index, element)` adds an element at a specified position, while `remove(element)` removes the first occurrence of a specified value.", "rationale": "This accurately describes the functionality of `insert()` and `remove()`.", "is_correct": true },
            { "text": "`insert()` adds at the end, `remove()` removes the last element.", "rationale": "This is incorrect; `insert()` adds at an index, and `remove()` targets a value, not necessarily the last element.", "is_correct": false },
            { "text": "`insert()` and `remove()` both return new lists.", "rationale": "This is incorrect; both modify the list in-place and return `None`.", "is_correct": false },
            { "text": "`insert()` only works with integers, `remove()` only with strings.", "rationale": "This is incorrect; both methods can work with various data types.", "is_correct": false }
        ]
    },
    {
        "question": "What is the primary function of the `pop()` method in Python lists?",
        "answer_options": [
            { "text": "It removes an element at a specified index and returns it.", "rationale": "`pop()` is used to remove an item by its index and also retrieve its value.", "is_correct": true },
            { "text": "It removes the first occurrence of a specified value.", "rationale": "This describes the `remove()` method.", "is_correct": false },
            { "text": "It clears all elements from the list.", "rationale": "This describes the `clear()` method.", "is_correct": false },
            { "text": "It sorts the list in descending order.", "rationale": "This describes the `sort()` method with `reverse=True` or `sorted()`.", "is_correct": false }
        ]
    },
    {
        "question": "Explain the difference between `count()` and `index()` methods for Python lists.",
        "answer_options": [
            { "text": "`count()` returns the number of times an element appears, while `index()` returns the index of the first occurrence of an element.", "rationale": "This correctly distinguishes the functionality of `count()` for frequency and `index()` for position.", "is_correct": true },
            { "text": "`count()` returns True/False, `index()` returns the last occurrence.", "rationale": "This is incorrect; `count()` returns an integer, and `index()` returns the first occurrence.", "is_correct": false },
            { "text": "`count()` modifies the list, `index()` creates a new list.", "rationale": "This is incorrect; both are query methods and do not modify the list.", "is_correct": false },
            { "text": "They are used interchangeably to find elements.", "rationale": "This is incorrect; they serve different purposes related to finding elements.", "is_correct": false }
        ]
    },
    {
        "question": "Compare and contrast the `sort()` method and the `sorted()` built-in function in Python.",
        "answer_options": [
            { "text": "`sort()` sorts the list in-place and returns `None`, while `sorted()` returns a new sorted list and leaves the original list unchanged.", "rationale": "This accurately highlights the in-place modification of `sort()` versus the new list creation of `sorted()`.", "is_correct": true },
            { "text": "`sort()` is for ascending order, `sorted()` for descending.", "rationale": "This is incorrect; both can sort in either order with the `reverse` argument.", "is_correct": false },
            { "text": "`sort()` works on tuples, `sorted()` works on lists.", "rationale": "This is incorrect; `sort()` is a list method, and `sorted()` works on any iterable.", "is_correct": false },
            { "text": "They are identical in functionality; the choice is stylistic.", "rationale": "This is incorrect; they have different effects on the original data structure.", "is_correct": false }
        ]
    },
    {
        "question": "What does the `reverse()` method do to a Python list, and what does it return?",
        "answer_options": [
            { "text": "It reverses the order of elements in the list in-place.", "rationale": "The `reverse()` method modifies the list by reversing its elements directly.", "is_correct": true },
            { "text": "It returns a new list with elements in reverse order.", "rationale": "This is incorrect; `reverse()` modifies in-place; `reversed()` returns an iterator.", "is_correct": false },
            { "text": "It sorts the list in descending order.", "rationale": "This is incorrect; `sort()` handles sorting, and `reverse()` only reverses the existing order.", "is_correct": false },
            { "text": "It removes elements from the end of the list.", "rationale": "This describes `pop()` without an index, not `reverse()`.", "is_correct": false }
        ]
    },
    {
        "question": "Describe the effect of calling the `clear()` method on a Python list.",
        "answer_options": [
            { "text": "It removes all elements from the list.", "rationale": "The `clear()` method empties the list, making it an empty list.", "is_correct": true },
            { "text": "It deletes the list from memory.", "rationale": "This is incorrect; `del list_name` would delete the list, not `clear()`.", "is_correct": false },
            { "text": "It sets all elements to `None`.", "rationale": "This is incorrect; `clear()` removes elements, it doesn't modify their values to `None`.", "is_correct": false },
            { "text": "It returns the first element of the list.", "rationale": "This describes indexing, not clearing the list.", "is_correct": false }
        ]
    },
    {
        "question": "What kind of copy does the `copy()` method create for a Python list?",
        "answer_options": [
            { "text": "It makes a shallow copy of the list.", "rationale": "A shallow copy creates a new list, but elements that are themselves objects are still referenced, not copied.", "is_correct": true },
            { "text": "It makes a deep copy of the list.", "rationale": "A deep copy requires the `copy.deepcopy()` function; `copy()` makes a shallow copy.", "is_correct": false },
            { "text": "It returns an iterator for the list.", "rationale": "This is incorrect; methods like `iter()` return iterators.", "is_correct": false },
            { "text": "It concatenates two lists.", "rationale": "This is incorrect; list concatenation is done with `+` or `extend()`.", "is_correct": false }
        ]
    },
    {
        "question": "What is a decorator in Python, and how is it used syntactically?",
        "answer_options": [
            { "text": "A decorator is a design pattern that allows a user to add new functionality to an existing object without altering its structure.", "rationale": "This broadly describes the concept of a decorator in programming.", "is_correct": false },
            { "text": "In Python, a decorator is a function that takes another function as an argument, adds some functionality, and returns a new function.", "rationale": "This specifically defines a decorator in Python as a callable that wraps another callable.", "is_correct": true },
            { "text": "A decorator is a type of class that automatically creates instances.", "rationale": "This describes a factory pattern or metaclass, not a decorator.", "is_correct": false },
            { "text": "A decorator is a keyword used to define asynchronous functions.", "rationale": "This is incorrect; `async` and `await` are for asynchronous functions.", "is_correct": false }
        ]
    },
    {
        "question": "What are the main benefits of using decorators in Python?",
        "answer_options": [
            { "text": "Code reuse, separation of concerns, and adding cross-cutting concerns like logging or timing.", "rationale": "Decorators enable modular addition of features without modifying the original function's code.", "is_correct": true },
            { "text": "Strict type enforcement for function arguments.", "rationale": "Type hints provide this functionality, not decorators.", "is_correct": false },
            { "text": "Creating new classes dynamically at runtime.", "rationale": "Metaclasses or type() are used for this, not decorators.", "is_correct": false },
            { "text": "Optimizing mathematical computations.", "rationale": "While decorators *can* be used to implement caching or memoization, their primary benefits are not solely mathematical optimization.", "is_correct": false }
        ]
    },
    {
        "question": "When writing a custom decorator, why is it common practice for the inner 'wrapper' function to accept `*args` and `**kwargs`?",
        "answer_options": [
            { "text": "The inner function is typically a `lambda` function.", "rationale": "While possible, the inner function is usually a nested `def` function to preserve metadata.", "is_correct": false },
            { "text": "The inner function takes `*args` and `**kwargs` to accept any arguments of the decorated function.", "rationale": "The `wrapper` function (inner function) must be able to accept the same arguments as the original function it wraps.", "is_correct": true },
            { "text": "The inner function directly modifies the source code of the decorated function.", "rationale": "This is incorrect; decorators modify behavior at runtime, not source code directly.", "is_correct": false },
            { "text": "The inner function must be named `wrapper`.", "rationale": "This is a convention, not a strict requirement.", "is_correct": false }
        ]
    },
    {
        "question": "What is the purpose of `functools.wraps` when creating Python decorators?",
        "answer_options": [
            { "text": "It ensures the wrapped function's `__name__`, `__doc__`, and `__module__` attributes are preserved.", "rationale": "`functools.wraps` is crucial for decorators to properly reflect the metadata of the original function.", "is_correct": true },
            { "text": "It automatically makes the decorator apply to all functions in a module.", "rationale": "This is incorrect; decorators are applied explicitly to individual functions.", "is_correct": false },
            { "text": "It converts a regular function into a decorator.", "rationale": "This is incorrect; `functools.wraps` is used within a decorator, not to define one.", "is_correct": false },
            { "text": "It handles error logging within the decorated function.", "rationale": "While logging can be added via decorators, `functools.wraps` doesn't handle the logging logic itself.", "is_correct": false }
        ]
    },
    {
        "question": "Explain the role of the nested 'wrapper' function within a typical Python decorator.",
        "answer_options": [
            { "text": "To ensure the decorated function can accept arbitrary positional and keyword arguments.", "rationale": "The nested `wrapper` function handles the arguments passed to the actual decorated function, ensuring flexibility.", "is_correct": true },
            { "text": "To make the decorator reusable for different types of arguments.", "rationale": "This is a consequence, but the primary reason is to correctly pass arguments to the *decorated* function.", "is_correct": false },
            { "text": "To perform argument validation before the function executes.", "rationale": "While decorators can do this, `*args` and `**kwargs` alone don't perform validation.", "is_correct": false },
            { "text": "To allow the decorator to be applied to methods within classes.", "rationale": "This is a separate concern regarding method decorators.", "is_correct": false }
        ]
    },
    {
        "question": "How do class decorators differ from function decorators in Python?",
        "answer_options": [
            { "text": "Class decorators modify the behavior of a class itself, such as adding methods or changing attribute access, when applied to a class definition.", "rationale": "Class decorators are applied to class definitions and can modify or replace the class object.", "is_correct": true },
            { "text": "Class decorators are used to create instances of classes without calling the constructor.", "rationale": "This describes a factory method or abstract factory pattern, not a class decorator.", "is_correct": false },
            { "text": "Class decorators are special methods within a class that define its behavior.", "rationale": "This describes dunder methods (e.g., `__init__`, `__str__`), not class decorators.", "is_correct": false },
            { "text": "Class decorators are only used for validating class attributes.", "rationale": "While they can validate, their scope is much broader, allowing structural changes or additional logic.", "is_correct": false }
        ]
    },
    {
        "question": "What is a method decorator in Python, and provide an example of a built-in one.",
        "answer_options": [
            { "text": "They are used for adding functionality to methods within a class.", "rationale": "Method decorators are essentially function decorators applied to methods, which are functions bound to instances or classes.", "is_correct": true },
            { "text": "They modify the class's inheritance hierarchy.", "rationale": "This is incorrect; class decorators or metaclasses can do this, not typically method decorators.", "is_correct": false },
            { "text": "They are only used with static methods and class methods.", "rationale": "This is incorrect; they can be used with instance methods as well.", "is_correct": false },
            { "text": "They prevent methods from being overridden by subclasses.", "rationale": "This is incorrect; decorators don't inherently prevent method overriding.", "is_correct": false }
        ]
    },
    {
        "question": "What is the common pattern of execution flow when a function is decorated in Python?",
        "answer_options": [
            { "text": "It ensures that the function runs asynchronously without blocking.", "rationale": "While a decorator could implement this, it's not the fundamental purpose of decorators themselves.", "is_correct": false },
            { "text": "It enables the function to be called with keyword arguments only.", "rationale": "This describes `*`, not the general purpose of decorators.", "is_correct": false },
            { "text": "It allows the original function to be called both before and after additional logic is executed.", "rationale": "Decorators allow wrapping the original function call with pre- and post-processing logic.", "is_correct": true },
            { "text": "It replaces the original function entirely with new code.", "rationale": "While decorators can replace functions, their primary intent is usually to *wrap* and *augment* existing functionality.", "is_correct": false }
        ]
    },
    {
        "question": "What is list slicing in Python, and how does it work?",
        "answer_options": [
            { "text": "List slicing creates a shallow copy of a portion of a list, defined by start, stop, and step indices.", "rationale": "This accurately describes list slicing, which generates new lists without modifying the original.", "is_correct": true },
            { "text": "List slicing modifies the original list in-place.", "rationale": "This is incorrect; slicing creates a new list, leaving the original unchanged.", "is_correct": false },
            { "text": "List slicing can only extract single elements.", "rationale": "This is incorrect; slicing extracts a sub-sequence of elements.", "is_correct": false },
            { "text": "List slicing is used to iterate over a list.", "rationale": "While slicing can be used in conjunction with iteration, its primary purpose is extraction.", "is_correct": false }
        ]
    },
    {
        "question": "Describe the full syntax for list slicing in Python, including the meaning of `start`, `stop`, and `step`.",
        "answer_options": [
            { "text": "`[start:stop:step]` where `start` is inclusive, `stop` is exclusive, and `step` defines the increment.", "rationale": "This is the correct syntax and behavior for list slicing.", "is_correct": true },
            { "text": "`[start, stop, step]` where all are inclusive.", "rationale": "This is incorrect; slicing uses colons, and the stop index is exclusive.", "is_correct": false },
            { "text": "`{start:stop:step}` for dictionary slicing.", "rationale": "This is incorrect; slicing syntax is for sequences, not dictionaries directly, and uses square brackets.", "is_correct": false },
            { "text": "`(start:stop:step)` for tuple slicing.", "rationale": "While similar, the brackets `[]` are specifically for list/string slicing.", "is_correct": false }
        ]
    },
    {
        "question": "What is the result of applying `[::-1]` slicing to a Python list?",
        "answer_options": [
            { "text": "It reverses the list.", "rationale": " `[::-1]` is a common idiom for reversing a list by slicing with a step of -1.", "is_correct": true },
            { "text": "It creates a deep copy of the list.", "rationale": "This is incorrect; it creates a shallow copy, reversed.", "is_correct": false },
            { "text": "It removes every other element.", "rationale": "This would be `[::2]` or `[::-2]` depending on direction.", "is_correct": false },
            { "text": "It sorts the list in descending order.", "rationale": "This is incorrect; `sort()` or `sorted()` handles sorting.", "is_correct": false }
        ]
    },
    {
        "question": "What is a list comprehension in Python, and how does its syntax compare to a traditional `for` loop?",
        "answer_options": [
            { "text": "A concise way to create new lists by applying an expression to each item in an iterable, optionally with a filter condition.", "rationale": "List comprehensions provide a compact and efficient way to build lists.", "is_correct": true },
            { "text": "A method for iterating through a list and modifying it in-place.", "rationale": "This describes an in-place loop modification, not list comprehension which creates a new list.", "is_correct": false },
            { "text": "A function that returns a generator object.", "rationale": "This describes generator expressions, which use parentheses `()` instead of square brackets `[]`.", "is_correct": false },
            { "text": "A syntax for defining recursive functions.", "rationale": "This is incorrect; recursion uses function calls.", "is_correct": false }
        ]
    },
    {
        "question": "What are the advantages of using list comprehensions over traditional `for` loops for creating new lists?",
        "answer_options": [
            { "text": "Readability, conciseness, and often better performance due to C implementation.", "rationale": "List comprehensions are generally preferred for their clarity and speed over explicit `for` loops for list creation.", "is_correct": true },
            { "text": "Reduced memory consumption for large lists.", "rationale": "While they can be optimized, they still create a new list in memory.", "is_correct": false },
            { "text": "Ability to modify the original iterable during iteration.", "rationale": "This is incorrect; list comprehensions create new lists and do not modify the original iterable in-place.", "is_correct": false },
            { "text": "Automatic error handling for invalid data.", "rationale": "This is incorrect; error handling must be explicitly managed.", "is_correct": false }
        ]
    },
    {
        "question": "What is the general syntax for a list comprehension that includes a conditional filter?",
        "answer_options": [
            { "text": "`[expression for item in iterable if condition]`", "rationale": "This is the correct general syntax for list comprehension, including an optional `if` clause for filtering.", "is_correct": true },
            { "text": "`(`expression for item in iterable if condition`)`", "rationale": "This is the syntax for a generator expression, not a list comprehension.", "is_correct": false },
            { "text": "`{item: expression for item in iterable}`", "rationale": "This is the syntax for a dictionary comprehension.", "is_correct": false },
            { "text": "`[item if condition else other_expression for item in iterable]`", "rationale": "This describes a conditional expression within a comprehension, not the general structure of the comprehension itself.", "is_correct": false }
        ]
    },
    {
        "question": "Given a list `my_list = [10, 20, 30, 40, 50, 60]`, what would `my_list[1:4]` return?",
        "answer_options": [
            { "text": "It extracts elements from index 1 (inclusive) up to, but not including, index 4.", "rationale": "This accurately describes how `[1:4]` slicing works, including the exclusive nature of the stop index.", "is_correct": true },
            { "text": "It extracts elements from index 1 to 4, inclusive.", "rationale": "This is incorrect; the stop index is exclusive.", "is_correct": false },
            { "text": "It extracts the element at index 4.", "rationale": "This describes `list[4]`.", "is_correct": false },
            { "text": "It returns a single element at index 1.", "rationale": "This is incorrect; slicing returns a list (or sub-sequence).", "is_correct": false }
        ]
    },
    {
        "question": "Write a list comprehension to extract all even numbers from a list called `my_list`.",
        "answer_options": [
            { "text": "`[x for x in my_list if x % 2 == 0]`", "rationale": "This correctly uses a list comprehension with a conditional to filter for even numbers.", "is_correct": true },
            { "text": "`filter(lambda x: x % 2 == 0, my_list)`", "rationale": "This uses `filter` with a lambda, which returns an iterator, not directly a list comprehension.", "is_correct": false },
            { "text": "`[x for x in my_list if x is even]`", "rationale": "`x is even` is not valid Python syntax for checking even numbers.", "is_correct": false },
            { "text": "`for x in my_list: if x % 2 == 0: new_list.append(x)`", "rationale": "This is a traditional `for` loop, not a list comprehension.", "is_correct": false }
        ]
    },
    {
        "question": "Identify the error in the following Python code snippet and explain how to fix it:\n```python\nx = 10\nif x > 5\n    print('Greater')\nelse:\n    print('Smaller')\n```",
        "answer_options": [
            { "text": "`SyntaxError: invalid syntax` due to missing colon after `if`.", "rationale": "Python expects a colon after `if` and `else` statements.", "is_correct": true },
            { "text": "`IndentationError: expected an indented block`.", "rationale": "Indentation is correct, but syntax error takes precedence.", "is_correct": false },
            { "text": "`NameError: name 'x' is not defined`.", "rationale": "`x` is defined, but the syntax is wrong.", "is_correct": false },
            { "text": "The code will run and print 'Greater'.", "rationale": "The code will not run due to the syntax error.", "is_correct": false }
        ]
    },
    {
        "question": "What error will occur in this Python code and why?\n```python\ndef greet():\n  print('Hello')\n    print('World')\ngreet()\n```",
        "answer_options": [
            { "text": "`IndentationError: unexpected indent` on the line `print('World')`.", "rationale": "The `print('World')` statement is incorrectly indented, causing an `IndentationError` as it's not aligned with `print('Hello')` or the function body.", "is_correct": true },
            { "text": "`SyntaxError: invalid syntax`.", "rationale": "The syntax is otherwise correct; the issue is with indentation.", "is_correct": false },
            { "text": "The code will print 'Hello'.", "rationale": "The code will not execute due to the indentation error.", "is_correct": false },
            { "text": "`TypeError: unsupported operand type(s)`.", "rationale": "No type-related operations are incorrect here.", "is_correct": false }
        ]
    },
    {
        "question": "What type of error will the following Python code produce?\n```python\nage = 25\nmessage = 'Age: ' + age\nprint(message)\n```",
        "answer_options": [
            { "text": "`TypeError: can only concatenate str (not 'int') to str`.", "rationale": "You cannot directly concatenate a string and an integer using the `+` operator without explicit type conversion.", "is_correct": true },
            { "text": "`SyntaxError: invalid syntax`.", "rationale": "The syntax for string and integer literals is correct.", "is_correct": false },
            { "text": "The code will print 'Age: 25'.", "rationale": "It will raise a `TypeError`.", "is_correct": false },
            { "text": "`ValueError: invalid literal for int()`.", "rationale": "No conversion from string to int is attempted here.", "is_correct": false }
        ]
    },
    {
        "question": "Identify the error in this Python snippet:\n```python\ndef increment_counter():\n    for _ in range(5):\n        counter += 1\n    print(counter)\nincrement_counter()\n```",
        "answer_options": [
            { "text": "`NameError: name 'counter' is not defined`.", "rationale": "The variable `counter` is used inside the loop before it has been assigned a value in the global or enclosing scope.", "is_correct": true },
            { "text": "The code will print numbers from 1 to 5.", "rationale": "It will raise a `NameError`.", "is_correct": false },
            { "text": "`UnboundLocalError: local variable 'counter' referenced before assignment`.", "rationale": "This would occur if `counter` was *assigned* within the function, then used before that assignment. Here it's merely used as an increment, not assigned, so `NameError` is correct for initial use.", "is_correct": false },
            { "text": "`TypeError: unsupported operand type(s)`.", "rationale": "The operation `counter += 1` is valid if `counter` is defined.", "is_correct": false }
        ]
    },
    {
        "question": "What error will the following Python code raise?\n```python\nresult = 10 / 0\nprint(result)\n```",
        "answer_options": [
            { "text": "`ZeroDivisionError: division by zero`.", "rationale": "An integer cannot be divided by zero; this is an undefined operation.", "is_correct": true },
            { "text": "The code will print `0`.", "rationale": "It will raise an error, not print `0`.", "is_correct": false },
            { "text": "`TypeError: unsupported operand type(s)`.", "rationale": "The types (int, int) are compatible for division.", "is_correct": false },
            { "text": "`ValueError: invalid literal for int()`.", "rationale": "No string-to-int conversion is involved.", "is_correct": false }
        ]
    },
    {
        "question": "The following Python code aims to calculate the product of all numbers in a list. Identify the logical error.\n```python\ndef calculate_product(numbers):\n    result = 0  # Should be 1 for product\n    for num in numbers:\n        result += num # Should be result *= num\n    return result\n\nmy_list = [1, 2, 3, 4]\nprint(calculate_product(my_list)) # Expected: 24, Actual: 10\n```",
        "answer_options": [
            { "text": "It calculates the sum of all numbers in the list, but it should calculate the product (initial `result` should be 1, operation `*=` instead of `+=`).", "rationale": "The initial `result` should be 1 for product, and the operation should be multiplication.", "is_correct": true },
            { "text": "It will cause an `IndexError` because the loop goes out of bounds.", "rationale": "The `for...in` loop is safe and does not use indices.", "is_correct": false },
            { "text": "It has a `SyntaxError` due to incorrect loop syntax.", "rationale": "The loop syntax is correct.", "is_correct": false },
            { "text": "It correctly calculates the product of all numbers.", "rationale": "It calculates the sum, not the product.", "is_correct": false }
        ]
    },
    {
        "question": "Which of the following is a common and effective technique for debugging Python code?",
        "answer_options": [
            { "text": "Inserting `print()` statements at various points to inspect variable values.", "rationale": "Print debugging is a common, simple, and effective way to understand program flow and variable states.", "is_correct": true },
            { "text": "Randomly changing lines of code until the error disappears.", "rationale": "This is a highly ineffective and dangerous debugging practice.", "is_correct": false },
            { "text": "Deleting large portions of code until the program runs without error.", "rationale": "This is destructive and doesn't help identify the root cause.", "is_correct": false },
            { "text": "Ignoring error messages and hoping the problem resolves itself.", "rationale": "Error messages are crucial for debugging and should not be ignored.", "is_correct": false }
        ]
    },
    {
        "question": "What will be the output of the following Python code for `i = 15`?\n```python\nfor i in range(1, 16):\n    if i % 3 == 0 and i % 5 == 0:\n        print('FizzBuzz')\n    elif i % 3 == 0:\n        print('Fizz')\n    elif i % 5 == 0:\n        print('Buzz')\n    else:\n        print(i)\n```",
        "answer_options": [
            { "text": "`FizzBuzz`", "rationale": "The loop will iterate from 1 to 15. For 15, it satisfies both conditions (divisible by 3 and 5), so it prints 'FizzBuzz'. The `if` condition is met first.", "is_correct": true },
            { "text": "`Fizz`", "rationale": "While 15 is divisible by 3, the `if` condition (FizzBuzz) is met first.", "is_correct": false },
            { "text": "`Buzz`", "rationale": "While 15 is divisible by 5, the `if` condition (FizzBuzz) is met first.", "is_correct": false },
            { "text": "`15`", "rationale": "The conditions will be met, so the number itself won't be printed.", "is_correct": false }
        ]
    },
    {
        "question": "What error will be raised when executing the following Python code?\n```python\nstudent = {'name': 'Alice', 'age': 20}\nprint(student['city'])\n```",
        "answer_options": [
            { "text": "`KeyError: 'city'` because 'city' is not a key in the dictionary.", "rationale": "Attempting to access a dictionary with a non-existent key raises a `KeyError`.", "is_correct": true },
            { "text": "`IndexError: list index out of range` because it's a dictionary, not a list.", "rationale": "Dictionaries raise `KeyError`, not `IndexError`.", "is_correct": false },
            { "text": "`AttributeError: 'dict' object has no attribute 'city'`.", "rationale": "AttributeError is for accessing non-existent attributes, not keys.", "is_correct": false },
            { "text": "The code will print nothing, but run without error.", "rationale": "It will raise an error and stop execution.", "is_correct": false }
        ]
    },
    {
        "question": "Examine the Python code below. What kind of error will it produce, and why?\n```python\nnumbers = [1, 2, 3]\nfor num in numbers:\n    x = num\n    print(x + 's')\n```",
        "answer_options": [
            { "text": "A `SyntaxError` due to incorrect loop variable assignment.", "rationale": "The `for` loop syntax is correct here.", "is_correct": false },
            { "text": "A `TypeError` when `x + 's'` is evaluated because `x` is an integer and cannot be concatenated with a string.", "rationale": "This is the correct explanation. If `x` remains an integer (which it will as it's assigned `num` from `numbers`), it cannot be concatenated with a string.", "is_correct": true },
            { "text": "The code will print '1s', '2s', '3s'.", "rationale": "It will raise a `TypeError`.", "is_correct": false },
            { "text": "An `IndentationError` in the `print` statement.", "rationale": "The indentation appears correct.", "is_correct": false }
        ]
    },
    // --- New Debugging Questions Below ---
    {
        "question": "What will be the output of the following Python expression if 'x=56.236`?\n```python\nprint('%.2f'%x)\n```",
        "answer_options": [
            {"text":"56.236","is_correct": false},
            {"text":"56.23","is_correct": false},
            {"text":"56.0000","is_correct": false},
            {"text":"56.24","is_correct": true}
            ]
    },
    {
        "question": "What error will this Python code raise if `my_list` is `[1, 2, 3]`?\n```python\nmy_list = [1, 2, 3]\nprint(my_list[3])\n```",
        "answer_options": [
            { "text": "`IndexError: list index out of range` because index 3 is beyond the valid range (0, 1, 2).", "rationale": "Lists in Python are 0-indexed, so for a list of 3 elements, valid indices are 0, 1, and 2. Attempting to access index 3 results in an `IndexError`.", "is_correct": true },
            { "text": "`TypeError: list indices must be integers or slices, not tuple`.", "rationale": "The index used is an integer, so this error would not occur.", "is_correct": false },
            { "text": "The code will print `3`.", "rationale": "The code will raise an error because index 3 doesn't exist.", "is_correct": false },
            { "text": "`KeyError: 3` because lists use indices, not keys.", "rationale": "KeyError applies to dictionaries, not lists.", "is_correct": false }
        ]
    },
    {
        "question": "Consider the following Python code. What kind of error will it produce?\n```python\ntext = 'hello'\nnumber = int(text)\nprint(number)\n```",
        "answer_options": [
            { "text": "`ValueError: invalid literal for int() with base 10: 'hello'` because 'hello' cannot be converted to an integer.", "rationale": "The `int()` function can only convert strings that represent valid integer numbers. 'hello' is not a valid integer representation.", "is_correct": true },
            { "text": "`TypeError: int() argument must be a string, a bytes-like object or a real number, not 'str'`.", "rationale": "The argument provided is a string, which is a valid type for `int()`, but its content is invalid.", "is_correct": false },
            { "text": "The code will print `0`.", "rationale": "The code will raise an error before printing anything.", "is_correct": false },
            { "text": "`SyntaxError: invalid syntax`.", "rationale": "The syntax is perfectly valid.", "is_correct": false }
        ]
    },
    {
        "question": "What is the error in this Python class and how do you fix it?\n```python\nclass Dog:\n    def __init__(self, name):\n        self.name = name\n\nmy_dog = Dog('Buddy')\nprint(my_dog.age)\n```",
        "answer_options": [
            { "text": "`AttributeError: 'Dog' object has no attribute 'age'` because the `Dog` class does not have an `age` attribute defined.", "rationale": "The `__init__` method only initializes `self.name`. To access `my_dog.age`, `age` must be defined as an attribute of the `Dog` class, perhaps in the `__init__` method or dynamically.", "is_correct": true },
            { "text": "`NameError: name 'age' is not defined`.", "rationale": "This would occur if `age` was a standalone variable not associated with an object or class.", "is_correct": false },
            { "text": "`TypeError: object() takes no parameters`.", "rationale": "The `Dog` class has an `__init__` method, so it correctly accepts parameters when instantiated.", "is_correct": false },
            { "text": "The code will print `None`.", "rationale": "Accessing a non-existent attribute raises an `AttributeError`.", "is_correct": false }
        ]
    },
    {
        "question": "If you try to open a file for reading that does not exist in Python, what error will be raised?\n```python\nwith open('non_existent_file.txt', 'r') as f:\n    content = f.read()\nprint(content)\n```",
        "answer_options": [
            { "text": "`FileNotFoundError: [Errno 2] No such file or directory: 'non_existent_file.txt'`.", "rationale": "Python raises `FileNotFoundError` specifically when an attempt is made to open a file that does not exist.", "is_correct": true },
            { "text": "`IOError: [Errno 2] No such file or directory`.", "rationale": "While `IOError` is a parent class, `FileNotFoundError` is more specific and commonly raised.", "is_correct": false },
            { "text": "`PermissionError: [Errno 13] Permission denied`.", "rationale": "This occurs if you don't have the necessary permissions to access a file, not if it doesn't exist.", "is_correct": false },
            { "text": "`ValueError: I/O operation on closed file`.", "rationale": "This occurs if you try to operate on a file that has already been closed.", "is_correct": false }
        ]
    },
    {
        "question": "What is the logical error in the following code, which tries to find if a number is present in a list?\n```python\ndef find_number(num_list, target):\n    for item in num_list:\n        if item == target:\n            return True # Should return False if loop finishes\n    return False # This line is often missed or placed incorrectly\n\nprint(find_number([1, 2, 3], 4))\n```",
        "answer_options": [
            { "text": "The `return False` statement is placed inside the loop, causing the function to exit after the first comparison if the target isn't the first element.", "rationale": "The `return False` should only be executed *after* the entire list has been checked and the target was not found. If it's inside the loop, it will prematurely exit.", "is_correct": true },
            { "text": "The function will raise a `TypeError` because `item` and `target` might be of different types.", "rationale": "The comparison `item == target` handles different types correctly without a `TypeError` for valid comparisons.", "is_correct": false },
            { "text": "The function will always return `True` regardless of whether the number is found.", "rationale": "No, it will return `False` if the target is not the first element due to the incorrect placement of `return False`.", "is_correct": false },
            { "text": "The `for` loop syntax is incorrect and will cause a `SyntaxError`.", "rationale": "The loop syntax is perfectly valid.", "is_correct": false }
        ]
    }
];

function displayCurrentQuestion() {
    quizContainer.innerHTML = ''; // Clear previous question and options

    // Clear previous question output images if any before adding new ones
    // We target existing images within the quizContainer or more broadly if they are prepended
    const existingOutputImages = quizContainer.querySelectorAll('.question-output-image, .question-output-description');
    existingOutputImages.forEach(el => el.remove());

    if (currentQuestionIndex < quizData.length) {
        const q = quizData[currentQuestionIndex];
        const questionBlock = document.createElement('div');
        questionBlock.classList.add('question-block');

        // Handle block_matching question's output image/description first
        if (q.question_type === "block_matching") {
            if (q.output_image) {
                const outputImg = document.createElement('img');
                outputImg.src = q.output_image;
                outputImg.alt = q.output_description || "Desired output visual";
                outputImg.classList.add('question-output-image');
                questionBlock.appendChild(outputImg); // Append to questionBlock
            } else if (q.output_description) {
                const outputDesc = document.createElement('p');
                outputDesc.textContent = "Desired Outcome: " + q.output_description;
                outputDesc.classList.add('question-output-description');
                questionBlock.appendChild(outputDesc);
            }
        }

        // Handle code blocks using a regex replace and preserve newlines for display
        // Also handle newlines for general question text
        const questionHtml = q.question.replace(/\n```python\n([\s\S]*?)\n```/g, '<pre><code>$1</code></pre>');
        const questionText = document.createElement('p');
        questionText.innerHTML = `Q${currentQuestionIndex + 1}: ${questionHtml.replace(/\n/g, '<br>')}`;
        questionBlock.appendChild(questionText);

        const optionsDiv = document.createElement('div');
        optionsDiv.classList.add('options');

        q.answer_options.forEach((option, optIndex) => {
            const label = document.createElement('label');
            const input = document.createElement('input');
            input.type = 'radio';
            input.name = `question${currentQuestionIndex}`; // Unique name for each question's radios
            input.value = optIndex;

            // If user has already answered this question, pre-select
            if (userAnswers[currentQuestionIndex] !== undefined && userAnswers[currentQuestionIndex] == optIndex) {
                input.checked = true;
            }

            label.appendChild(input);

            // If it's a block_matching question, display the block image
            if (q.question_type === "block_matching" && option.block_image) {
                const blockImg = document.createElement('img');
                blockImg.src = option.block_image;
                blockImg.alt = option.text;
                blockImg.classList.add('block-option-image');
                label.appendChild(blockImg);
                label.appendChild(document.createElement('br')); // New line after image
                label.appendChild(document.createTextNode(option.text)); // Text below image
            } else {
                label.append(option.text); // Regular text option
            }
            optionsDiv.appendChild(label);
        });
        questionBlock.appendChild(optionsDiv);
        quizContainer.appendChild(questionBlock);

        // Update button text for last question
        if (currentQuestionIndex === quizData.length - 1) {
            nextButton.textContent = 'Submit Quiz';
        } else {
            nextButton.textContent = 'Next Question';
        }
        nextButton.style.display = 'block'; // Ensure next button is visible
        submitBtn.style.display = 'none'; // Ensure the redundant submit button is hidden
    } else {
        console.error("Attempted to display question beyond quizData length.");
    }
}

// Function to handle Next/Submit button click
function handleNextButtonClick() {
    // 1. Save current answer
    const selectedOption = document.querySelector(`input[name="question${currentQuestionIndex}"]:checked`);
    if (selectedOption) {
        userAnswers[currentQuestionIndex] = parseInt(selectedOption.value);
        // Clear any previous error message if an option is selected
        resultElement.textContent = '';
    } else {
        // If no option is selected, show a message and don't proceed
        resultElement.textContent = 'Please select an answer before proceeding.';
        resultElement.style.color = 'orange';
        return; // Stop the function here
    }

    // 2. Check if it's the last question
    if (currentQuestionIndex < quizData.length - 1) {
        currentQuestionIndex++; // Move to next question
        displayCurrentQuestion(); // Display the next question
    } else {
        // It's the last question, now submit the quiz and show results
        showResults();
        nextButton.style.display = 'none'; // Hide the button after submission
        restartBtn.style.display = 'block'; // Show restart button
    }
}

// Function to show all results and final score
function showResults() {
    quizContainer.innerHTML = '<h2>Quiz Results</h2>'; // Clear the single question view, add a header
    quizContainer.classList.remove('hidden'); // Ensure quiz container is visible for results
    scoreSection.style.display = 'block'; // Show the score summary section

    let totalScore = 0;
    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;

    quizData.forEach((q, index) => {
        const questionBlock = document.createElement('div');
        questionBlock.classList.add('question-block', 'result-question-block'); // Add a class for result styling

        // Handle block_matching question's output image/description first
        if (q.question_type === "block_matching") {
            if (q.output_image) {
                const outputImg = document.createElement('img');
                outputImg.src = q.output_image;
                outputImg.alt = q.output_description || "Desired output visual";
                outputImg.classList.add('question-output-image', 'result-output-image');
                questionBlock.appendChild(outputImg);
            } else if (q.output_description) {
                const outputDesc = document.createElement('p');
                outputDesc.textContent = "Desired Outcome: " + q.output_description;
                outputDesc.classList.add('question-output-description', 'result-output-description');
                questionBlock.appendChild(outputDesc);
            }
        }


        // Display question
        const questionHtml = q.question.replace(/\n```python\n([\s\S]*?)\n```/g, '<pre><code>$1</code></pre>');
        const questionText = document.createElement('p');
        questionText.innerHTML = `Q${index + 1}: ${questionHtml.replace(/\n/g, '<br>')}`;
        questionBlock.appendChild(questionText);

        const optionsDiv = document.createElement('div');
        optionsDiv.classList.add('options', 'result-options');

        const selectedAnswerIndex = userAnswers[index];
        const correctAnswerObj = q.answer_options.find(opt => opt.is_correct);

        q.answer_options.forEach((option, optIndex) => {
            const optionP = document.createElement('p');
            // If it's a block_matching question, display the block image
            if (q.question_type === "block_matching" && option.block_image) {
                const blockImg = document.createElement('img');
                blockImg.src = option.block_image;
                blockImg.alt = option.text;
                blockImg.classList.add('block-option-image', 'result-block-image');
                optionP.appendChild(blockImg);
                optionP.appendChild(document.createElement('br'));
                optionP.appendChild(document.createTextNode(option.text));
            } else {
                 optionP.textContent = option.text; // Default text content
            }


            // Highlight user's choice
            if (optIndex === selectedAnswerIndex) {
                optionP.classList.add('user-selected');
            }

            // Highlight correct answer
            if (option.is_correct) {
                optionP.classList.add('correct-answer');
            }

            // Specific styling for incorrect user choice
            if (optIndex === selectedAnswerIndex && !option.is_correct) {
                optionP.classList.add('user-incorrect');
            }

            optionsDiv.appendChild(optionP);
        });
        questionBlock.appendChild(optionsDiv);

        // Feedback section for each question
        const feedbackDiv = document.createElement('div');
        feedbackDiv.classList.add('feedback');

        if (selectedAnswerIndex !== null && selectedAnswerIndex !== undefined) {
            const selectedOption = q.answer_options[selectedAnswerIndex];
            const isCorrect = selectedOption.is_correct;

            if (isCorrect) {
                totalScore += 2;
                correctCount++;
                feedbackDiv.classList.add('correct');
                feedbackDiv.textContent = 'Correct!';
            } else {
                totalScore -= 1;
                incorrectCount++;
                feedbackDiv.classList.add('incorrect');
                feedbackDiv.innerHTML = `Incorrect. Correct answer: <span class="correct-answer-text">${correctAnswerObj.text}</span>. Rationale: ${correctAnswerObj.rationale}`;
            }
        } else {
            unansweredCount++;
            feedbackDiv.classList.add('unanswered'); // New class for unanswered
            feedbackDiv.innerHTML = `Unanswered. Correct answer: <span class="correct-answer-text">${correctAnswerObj.text}</span>. Rationale: ${correctAnswerObj.rationale}`;
        }
        questionBlock.appendChild(feedbackDiv);
        quizContainer.appendChild(questionBlock);
    });

    // Display final score summary
    finalScoreSpan.textContent = totalScore;
    scoreDetailsParagraph.innerHTML = `Correct: ${correctCount}<br>Incorrect: ${incorrectCount}<br>Unanswered: ${unansweredCount}`;
    scoreSection.style.display = 'block'; // Ensure score section is visible
}


// Function to start the quiz - modified to call displayCurrentQuestion
function startQuiz() {
    instructionsScreen.classList.add('hidden'); // Hide instructions
    quizContainer.classList.remove('hidden'); // Show quiz
    currentQuestionIndex = 0;
    userAnswers = new Array(quizData.length).fill(null); // Initialize userAnswers array
    scoreSection.style.display = 'none'; // Hide score section if starting new quiz
    resultElement.textContent = ''; // Clear previous messages
    submitBtn.classList.add('hidden'); // Ensure the old submit button is always hidden
    restartBtn.classList.add('hidden'); // Hide restart button when starting
    displayCurrentQuestion();
}


// Event Listeners
startQuizBtn.addEventListener('click', startQuiz);
nextButton.addEventListener('click', handleNextButtonClick);
restartBtn.addEventListener('click', () => {
    instructionsScreen.classList.remove('hidden'); // Show instructions again
    quizContainer.classList.add('hidden'); // Hide quiz
    scoreSection.style.display = 'none'; // Hide score section
    restartBtn.classList.add('hidden'); // Hide restart button
});

// Initial display: Show the instructions screen when the page loads
document.addEventListener('DOMContentLoaded', () => {
    quizContainer.classList.add('hidden');
    instructionsScreen.classList.remove('hidden');
    submitBtn.classList.add('hidden'); // Ensure submit button is hidden initially
    nextButton.style.display = 'none'; // Initially hide next button until quiz starts
});