class Stack {
	constructor(items = []) {
		this.items = items;
	}

	// Add an element to the top of the stack
	push(element) {
		this.items.unshift(element); // Adds to the beginning
	}

	// Remove and return the top element of the stack
	pop() {
		if (this.isEmpty()) {
			return "Stack is empty";
		}
		return this.items.shift(); // Removes from the beginning
	}

	// Return the top element of the stack without removing it
	peek() {
		if (this.isEmpty()) {
			return "Stack is empty";
		}
		return this.items[0]; // First element
	}

	// Check if the stack is empty
	isEmpty() {
		return this.items.length === 0;
	}

	// Return the size of the stack
	size() {
		return this.items.length;
	}

	// Empty the stack
	clear() {
		this.items = [];
	}
}

export default Stack;
