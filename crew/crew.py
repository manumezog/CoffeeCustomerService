"""
Ember & Roast Development Team - CrewAI Implementation

This crew simulates a professional development team building the Ember & Roast
e-commerce shop with AI agents in specialized roles:
- Product Manager: Defines requirements and user stories
- UI Designer: Creates design system and layouts
- Frontend Engineer: Builds UI components and pages
- Backend Engineer: Creates APIs and data models

The agents work sequentially, with each agent's output informing the next agent's work.
"""

from crewai import Agent, Task, Crew
from crewai.project import CrewBase, agent, crew, task
import yaml
from pathlib import Path


@CrewBase
class EmberAndRoastCrew:
    """Ember & Roast Development Team Crew"""

    agents_config = "config/agents.yaml"
    tasks_config = "config/tasks.yaml"

    # Load configurations
    def __init__(self):
        self.agents_config_path = Path(__file__).parent / self.agents_config
        self.tasks_config_path = Path(__file__).parent / self.tasks_config

        with open(self.agents_config_path) as f:
            self.agents_yaml = yaml.safe_load(f)

        with open(self.tasks_config_path) as f:
            self.tasks_yaml = yaml.safe_load(f)

    @agent
    def product_manager(self) -> Agent:
        """Product Manager Agent"""
        config = self.agents_yaml["product_manager"]
        return Agent(
            role=config["role"],
            goal=config["goal"],
            backstory=config["backstory"],
            verbose=True,
            # allow_delegation=False  # Each agent focuses on their own work
        )

    @agent
    def ui_designer(self) -> Agent:
        """UI Designer Agent"""
        config = self.agents_yaml["ui_designer"]
        return Agent(
            role=config["role"],
            goal=config["goal"],
            backstory=config["backstory"],
            verbose=True,
        )

    @agent
    def frontend_engineer(self) -> Agent:
        """Frontend Engineer Agent"""
        config = self.agents_yaml["frontend_engineer"]
        return Agent(
            role=config["role"],
            goal=config["goal"],
            backstory=config["backstory"],
            verbose=True,
        )

    @agent
    def backend_engineer(self) -> Agent:
        """Backend Engineer Agent"""
        config = self.agents_yaml["backend_engineer"]
        return Agent(
            role=config["role"],
            goal=config["goal"],
            backstory=config["backstory"],
            verbose=True,
        )

    @task
    def product_catalog_task(self) -> Task:
        """Product Catalog Definition Task"""
        config = self.tasks_yaml["product_catalog_task"]
        return Task(
            description=config["description"],
            expected_output=config["expected_output"],
            agent=self.product_manager(),
            output_file="../docs/product_requirements.md",
        )

    @task
    def user_stories_task(self) -> Task:
        """User Stories Task"""
        config = self.tasks_yaml["user_stories_task"]
        return Task(
            description=config["description"],
            expected_output=config["expected_output"],
            agent=self.product_manager(),
            output_file="../docs/user_stories.md",
        )

    @task
    def design_system_task(self) -> Task:
        """Design System Task"""
        config = self.tasks_yaml["design_system_task"]
        return Task(
            description=config["description"],
            expected_output=config["expected_output"],
            agent=self.ui_designer(),
            output_file="../docs/design_system.md",
        )

    @task
    def page_layouts_task(self) -> Task:
        """Page Layouts Task"""
        config = self.tasks_yaml["page_layouts_task"]
        return Task(
            description=config["description"],
            expected_output=config["expected_output"],
            agent=self.ui_designer(),
            output_file="../docs/page_layouts.md",
        )

    @task
    def product_api_task(self) -> Task:
        """Product API Task"""
        config = self.tasks_yaml["product_api_task"]
        return Task(
            description=config["description"],
            expected_output=config["expected_output"],
            agent=self.backend_engineer(),
            output_file="../shop/src/data/products.json",
        )

    @task
    def orders_database_task(self) -> Task:
        """Orders Database Task"""
        config = self.tasks_yaml["orders_database_task"]
        return Task(
            description=config["description"],
            expected_output=config["expected_output"],
            agent=self.backend_engineer(),
            output_file="../shop/src/data/orders.json",
        )

    @task
    def api_routes_task(self) -> Task:
        """API Routes Task"""
        config = self.tasks_yaml["api_routes_task"]
        return Task(
            description=config["description"],
            expected_output=config["expected_output"],
            agent=self.backend_engineer(),
            output_file="../docs/api_routes.md",
        )

    @task
    def ui_components_task(self) -> Task:
        """UI Components Task"""
        config = self.tasks_yaml["ui_components_task"]
        return Task(
            description=config["description"],
            expected_output=config["expected_output"],
            agent=self.frontend_engineer(),
            # output_file="../shop/src/components/"  # Would write multiple files
        )

    @task
    def product_pages_task(self) -> Task:
        """Product Pages Task"""
        config = self.tasks_yaml["product_pages_task"]
        return Task(
            description=config["description"],
            expected_output=config["expected_output"],
            agent=self.frontend_engineer(),
            # output_file="../shop/src/app/products/"  # Would write multiple files
        )

    @task
    def homepage_task(self) -> Task:
        """Homepage Task"""
        config = self.tasks_yaml["homepage_task"]
        return Task(
            description=config["description"],
            expected_output=config["expected_output"],
            agent=self.frontend_engineer(),
            output_file="../shop/src/app/page.tsx",
        )

    @crew
    def crew(self) -> Crew:
        """Create the crew"""
        return Crew(
            agents=[
                self.product_manager(),
                self.ui_designer(),
                self.backend_engineer(),
                self.frontend_engineer(),
            ],
            tasks=[
                # PM Phase
                self.product_catalog_task(),
                self.user_stories_task(),
                # Designer Phase (depends on PM)
                self.design_system_task(),
                self.page_layouts_task(),
                # Backend Phase (independent)
                self.product_api_task(),
                self.orders_database_task(),
                self.api_routes_task(),
                # Frontend Phase (depends on design & backend)
                self.ui_components_task(),
                self.product_pages_task(),
                self.homepage_task(),
            ],
            verbose=True,
            # process=Process.sequential  # Tasks run one by one
        )
