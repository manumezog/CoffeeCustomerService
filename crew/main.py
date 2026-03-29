#!/usr/bin/env python
"""
Ember & Roast Development Team Entry Point

This script runs the CrewAI development team to simulate building the Ember & Roast
e-commerce shop with AI agents in specialized roles.

Usage:
    python main.py

The crew will:
1. Product Manager defines requirements and user stories
2. Designer creates design system and layouts
3. Backend Engineer builds APIs and data models
4. Frontend Engineer builds UI components and pages

All outputs are saved to the shop and docs directories.
"""

import os
from dotenv import load_dotenv
from crew import EmberAndRoastCrew


def run():
    """Run the Ember & Roast development crew"""
    # Load environment variables
    load_dotenv()

    # Initialize the crew
    crew = EmberAndRoastCrew()

    # Get the initialized crew and run it
    inputs = {
        "project_name": "Ember & Roast",
        "project_description": "Premium specialty coffee roaster with multi-channel customer service",
        "tech_stack": "Next.js 14, React, TypeScript, Tailwind CSS, Firebase, Firestore",
    }

    print("=" * 80)
    print("EMBER & ROAST DEVELOPMENT TEAM")
    print("=" * 80)
    print(f"\nProject: {inputs['project_name']}")
    print(f"Description: {inputs['project_description']}")
    print(f"Tech Stack: {inputs['tech_stack']}")
    print("\nStarting crew execution...")
    print("-" * 80)

    result = crew.crew().kickoff(inputs=inputs)

    print("\n" + "=" * 80)
    print("CREW EXECUTION COMPLETE")
    print("=" * 80)
    print("\nOutput:")
    print(result)

    return result


if __name__ == "__main__":
    run()
