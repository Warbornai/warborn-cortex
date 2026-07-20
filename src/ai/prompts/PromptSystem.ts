// Prompt Builder & Templating

export class PromptTemplate {
  private template: string;
  constructor(template: string) {
    this.template = template;
  }

  public format(variables: Record<string, string>): string {
    let result = this.template;
    for (const [key, value] of Object.entries(variables)) {
      result = result.replace(new RegExp(`\\$\\{${key}\\}`, 'g'), value);
    }
    return result;
  }
}

export class PromptBuilder {
  private promptParts: string[] = [];

  public append(text: string): this {
    this.promptParts.push(text);
    return this;
  }

  public build(): string {
    return this.promptParts.join('\n');
  }
}
